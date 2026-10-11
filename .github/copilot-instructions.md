# GitHub Docs repository instructions

## Repository overview

- This repository powers `docs.github.com`. It is a Node.js application built with
  TypeScript, Express, React, and Next.js.
- Application code is organized by capability under `src/`. Put code and tests in the
  most specific subject folder, and read that folder's `README.md` before making changes.
- English documentation lives under `content/`. Shared documentation data lives under
  `data/`, and static files live under `assets/`.
- Use the `@/` import alias for modules under `src/` when it matches nearby code.

## Making changes

- Keep changes focused and follow existing patterns in the affected subject.
- Use TypeScript for new scripts rather than Bash when practical so scripts remain
  cross-platform.
- TypeScript is strict and uses ES modules. Formatting uses single quotes, no semicolons,
  and a 100-character print width.
- In server application code, use the structured logger rather than `console`.
- Use `res.safeRedirect()` rather than `res.redirect()`.
- Do not use `dangerouslySetInnerHTML`; use the repository's trusted HTML rendering
  helpers or a hast tree.
- Do not edit generated API, GraphQL, webhook, or release data manually. Check the
  relevant subject `README.md` for its sync or generation command.

## Documentation content

- Follow the GitHub Docs style guide: write clearly and concisely, address the reader as
  "you", prefer active voice, and use inclusive language.
- Content pages require valid YAML frontmatter, including a `versions` mapping. Preserve
  Liquid tags and versioning unless the change explicitly requires updating them.
- Use site-relative links such as `/en/...` for published documentation and repository-
  relative links where established by nearby content.
- Reuse existing entries from `data/reusables/` and `data/variables/` instead of
  duplicating shared text or product names.

## Validation

- Install dependencies with `npm ci --include=optional` when test dependencies are
  needed.
- Run `npm run lint` for TypeScript and TSX changes, `npm run tsc` for type checking, and
  `npm run prettier-check` for supported formatted files.
- Run `npm run lint-content -- --paths <changed-paths>` for changed content or data
  Markdown.
- Tests use Vitest. Never run an unscoped `npm test`; target the affected subject:
  `npm test -- src/<subject>/tests/` or a specific test file.
- Many test suites require `npm run build` first. Prefer dedicated scripts such as
  `npm run test:article-api`, `npm run test:fixtures`, or `npm run test:landings` when
  available. Search and language tests also require Elasticsearch.
- End-to-end browser tests use Playwright and fixture content under `src/fixtures/`.
- When adding a new subject test suite, ensure it is represented in the repository's
  test workflow and required-check configuration.
