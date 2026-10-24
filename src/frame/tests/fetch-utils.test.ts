import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'

import { fetchWithRetry, readBodyWithTimeout } from '@/frame/lib/fetch-utils'

const statsdIncrement = vi.fn()

vi.mock('@/observability/lib/statsd', () => ({
  default: {
    increment: (...args: unknown[]) => statsdIncrement(...args),
  },
}))

function timeoutError(): DOMException {
  return new DOMException('The operation timed out', 'TimeoutError')
}

function abortError(): DOMException {
  return new DOMException('The operation was aborted', 'AbortError')
}

describe('fetchWithRetry retry policy', () => {
  const fetchMock = vi.fn<typeof fetch>()

  beforeEach(() => {
    vi.useFakeTimers()
    fetchMock.mockReset()
    vi.stubGlobal('fetch', fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  test.each([true, false])(
    'retries server errors before returning a successful response (throwHttpErrors: %s)',
    async (throwHttpErrors) => {
      const response = new Response('ok')
      const init: RequestInit = { headers: { accept: 'application/json' } }
      fetchMock
        .mockResolvedValueOnce(new Response('', { status: 503 }))
        .mockResolvedValueOnce(new Response('', { status: 502 }))
        .mockResolvedValueOnce(response)

      const promise = fetchWithRetry('https://example.test/retry', init, {
        retries: 2,
        throwHttpErrors,
      })
      const assertion = expect(promise).resolves.toBe(response)
      await vi.runAllTimersAsync()
      await assertion

      expect(fetchMock).toHaveBeenCalledTimes(3)
      for (const call of fetchMock.mock.calls) {
        expect(call).toEqual(['https://example.test/retry', init])
      }
    },
  )

  test('throws the final server error when the retry budget is exhausted', async () => {
    fetchMock
      .mockResolvedValueOnce(new Response('', { status: 503, statusText: 'Service Unavailable' }))
      .mockResolvedValue(new Response('', { status: 502, statusText: 'Bad Gateway' }))

    const assertion = expect(
      fetchWithRetry('https://example.test/unavailable', {}, { retries: 2 }),
    ).rejects.toThrow('HTTP 502: Bad Gateway')
    await vi.runAllTimersAsync()
    await assertion

    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  test('returns the final server error response when HTTP errors are disabled', async () => {
    const response = new Response('', { status: 503 })
    fetchMock.mockResolvedValue(response)

    const assertion = expect(
      fetchWithRetry(
        'https://example.test/unavailable',
        {},
        { retries: 2, throwHttpErrors: false },
      ),
    ).resolves.toBe(response)
    await vi.runAllTimersAsync()
    await assertion

    expect(fetchMock).toHaveBeenCalledTimes(3)
  })

  test.each([400, 404, 408, 413])('does not retry HTTP %s errors', async (status) => {
    fetchMock.mockResolvedValue(new Response('', { status }))

    const assertion = expect(
      fetchWithRetry('https://example.test/client-error', {}, { retries: 2 }),
    ).rejects.toThrow(`HTTP ${status}:`)
    await vi.runAllTimersAsync()
    await assertion

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  test('retries HTTP 429 when HTTP errors are enabled', async () => {
    const response = new Response('ok')
    fetchMock
      .mockResolvedValueOnce(new Response('', { status: 429 }))
      .mockResolvedValueOnce(response)

    const assertion = expect(
      fetchWithRetry('https://example.test/rate-limited', {}, { retries: 1 }),
    ).resolves.toBe(response)
    await vi.runAllTimersAsync()
    await assertion

    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  test('returns HTTP 429 without retrying when HTTP errors are disabled', async () => {
    const response = new Response('', { status: 429 })
    fetchMock.mockResolvedValue(response)

    await expect(
      fetchWithRetry(
        'https://example.test/rate-limited',
        {},
        { retries: 2, throwHttpErrors: false },
      ),
    ).resolves.toBe(response)

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('fetchWithRetry timeout', () => {
  const fetchMock = vi.fn()
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    statsdIncrement.mockReset()
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  test('returns the response when fetch succeeds', async () => {
    fetchMock.mockResolvedValue(new Response('ok', { status: 200 }))

    const response = await fetchWithRetry('https://example.test/ok', {}, { timeout: 1_000 })

    expect(response.status).toBe(200)
    expect(statsdIncrement).not.toHaveBeenCalled()
  })

  test('translates a time-to-first-byte timeout and emits the metric', async () => {
    fetchMock.mockRejectedValue(timeoutError())

    await expect(
      fetchWithRetry('https://example.test/slow', {}, { retries: 0, timeout: 1_000 }),
    ).rejects.toThrow('Request timed out after 1000ms')

    expect(statsdIncrement).toHaveBeenCalledWith('fetch.timeout', 1, ['host:example.test'])
  })

  test('does not treat a caller-initiated abort as a timeout', async () => {
    fetchMock.mockRejectedValue(abortError())

    await expect(
      fetchWithRetry('https://example.test/aborted', {}, { retries: 0, timeout: 1_000 }),
    ).rejects.toMatchObject({ name: 'AbortError' })

    expect(statsdIncrement).not.toHaveBeenCalled()
  })
})

describe('fetchWithRetry ttfb timeout mode', () => {
  const fetchMock = vi.fn()
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    statsdIncrement.mockReset()
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  test('clears the timer once the response resolves so body reads are unbounded', async () => {
    let capturedSignal: AbortSignal | undefined
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      capturedSignal = init?.signal ?? undefined
      return Promise.resolve(new Response('ok', { status: 200 }))
    })

    await fetchWithRetry('https://example.test/big', {}, { timeout: 10, timeoutMode: 'ttfb' })

    // Wait past the TTFB deadline to prove response resolution cleared the timer.
    await new Promise((resolve) => setTimeout(resolve, 40))
    expect(capturedSignal?.aborted).toBe(false)
    expect(statsdIncrement).not.toHaveBeenCalled()
  })

  test('translates a time-to-first-byte timeout and emits the metric', async () => {
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal as AbortSignal
        signal.addEventListener('abort', () => reject(signal.reason))
      })
    })

    await expect(
      fetchWithRetry(
        'https://example.test/slow',
        {},
        { retries: 0, timeout: 10, timeoutMode: 'ttfb' },
      ),
    ).rejects.toThrow('Request timed out after 10ms')

    expect(statsdIncrement).toHaveBeenCalledWith('fetch.timeout', 1, ['host:example.test'])
  })

  test('does not treat a caller-initiated abort as a timeout', async () => {
    const callerController = new AbortController()
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      return new Promise((_resolve, reject) => {
        const signal = init?.signal as AbortSignal
        signal.addEventListener('abort', () => reject(signal.reason ?? abortError()))
      })
    })

    const promise = fetchWithRetry(
      'https://example.test/aborted',
      { signal: callerController.signal },
      { retries: 0, timeout: 10_000, timeoutMode: 'ttfb' },
    )
    callerController.abort(abortError())

    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    expect(statsdIncrement).not.toHaveBeenCalled()
  })
})

describe('readBodyWithTimeout', () => {
  beforeEach(() => {
    statsdIncrement.mockReset()
  })

  test('returns the consumed body when the read succeeds', async () => {
    const response = new Response(JSON.stringify({ hello: 'world' }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })

    const result = await readBodyWithTimeout(response, () => response.json(), 1_000)

    expect(result).toEqual({ hello: 'world' })
    expect(statsdIncrement).not.toHaveBeenCalled()
  })

  test('translates a body-transfer timeout and emits the metric', async () => {
    const response = new Response('', { status: 200 })
    Object.defineProperty(response, 'url', { value: 'https://example.test/big' })

    await expect(
      readBodyWithTimeout(response, () => Promise.reject(timeoutError()), 8_000),
    ).rejects.toThrow('Request timed out after 8000ms')

    expect(statsdIncrement).toHaveBeenCalledWith('fetch.timeout', 1, ['host:example.test'])
  })

  test('rethrows non-timeout errors untouched without emitting the metric', async () => {
    const response = new Response('', { status: 200 })
    const boom = new Error('boom')

    await expect(readBodyWithTimeout(response, () => Promise.reject(boom), 8_000)).rejects.toBe(
      boom,
    )

    expect(statsdIncrement).not.toHaveBeenCalled()
  })
})

describe('fetchStream timeout mode', () => {
  const fetchMock = vi.fn()
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    statsdIncrement.mockReset()
    fetchMock.mockReset()
    globalThis.fetch = fetchMock as unknown as typeof fetch
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  test('defaults to ttfb so the body stream is not aborted after the response resolves', async () => {
    const { fetchStream } = await import('@/frame/lib/fetch-utils')

    let capturedSignal: AbortSignal | undefined
    fetchMock.mockImplementation((_url: string, init?: RequestInit) => {
      capturedSignal = init?.signal ?? undefined
      return Promise.resolve(new Response('chunk', { status: 200 }))
    })

    await fetchStream('https://example.test/stream', {}, { timeout: 10, throwHttpErrors: false })

    // Wait past the TTFB deadline to prove response resolution cleared the default timer.
    await new Promise((resolve) => setTimeout(resolve, 40))
    expect(capturedSignal?.aborted).toBe(false)
    expect(statsdIncrement).not.toHaveBeenCalled()
  })
})
