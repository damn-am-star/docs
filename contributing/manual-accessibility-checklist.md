# Manual accessibility audit checklist

Use this overview and its five standalone checklists to evaluate web interfaces against **WCAG 2.2 Level AA**, which includes both Level A and Level AA success criteria. Each category checklist gives manual steps, expected pass results, criterion references and exceptions, and appropriate tools. Record a separate result for each applicable page, component, state, and environment.

This is a practical starting point, not an exhaustive checklist or certification of conformance. Conformance also requires evaluating every applicable criterion and the WCAG conformance requirements, including full pages and complete processes. Automated scans cannot establish conformance, and passing this checklist does not prove that an interface is accessible to everyone. This document is testing guidance, not a report of tests performed.

The authoritative sources are the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) and the [customizable WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/). Criterion numbers below refer to that standard. Unless marked **Recommended**, expected results describe A or AA requirements; suggested testing techniques and tool combinations are recommendations, not mandated implementations.

## Set up the audit

1. Define the scope: URLs, build or commit, roles, permissions, languages, third-party integrations, and excluded areas. Include representative templates and all pages in selected complete processes, not just the home page.
1. Choose full journeys such as sign-in and account recovery, search and filtering, form submission, purchase, and editing or deleting information. Use safe test accounts and data.
1. Include desktop and mobile responsive layouts, portrait and landscape, relevant themes, and dialogs, menus, tooltips, expanded panels, loading, empty, error, and success states. Test responsive functionality, not only screenshots.
1. Record operating system, browser and version, assistive technology and version, device or input method, viewport in CSS pixels, zoom or text-size settings, and theme. Start keyboard-only testing with the screen reader off; then repeat relevant journeys with it on.
1. Run complementary automated checks on each significant state, then perform the manual checks below. Deduplicate findings, repair root causes, and retest the original steps and affected journeys.

**Recommended:** Include people with disabilities in usability testing. Select browser and assistive-technology combinations based on the supported audience, and document coverage gaps. One combination cannot demonstrate universal accessibility.

### Record results

Use **Pass**, **Fail**, or **Not applicable** for each check. Explain every Not applicable result, such as "no live synchronized media in scope." Do not mark an untested check Pass or Not applicable: leave it unassessed and list it as a coverage gap.

Copy this record for each finding or checked scenario:

| Field | What to record |
| --- | --- |
| Check and criterion | Checklist row, WCAG success criterion number and level |
| Scope and state | URL, build, role, journey step, component, and state |
| Environment | OS, browser, assistive technology and versions; input, viewport, zoom, theme |
| Result | Pass / Fail / Not applicable, with justification |
| Reproduction | Numbered steps, starting conditions, and test data without secrets |
| Expected / actual | Observable expected behavior and what happened instead |
| Evidence | Screenshot, recording, accessibility-tree details, measurements, or announcement transcript; remove sensitive data |
| Follow-up | User impact, owner, issue link, fix, and retest result and environment |

## Tools

| Tool | Practical use |
| --- | --- |
| Keyboard alone | Use Tab, Shift+Tab, Enter, Space, arrow keys, and Escape as appropriate. Check complete journeys, focus, and widget interactions without a mouse. On macOS, enable keyboard navigation in system/browser settings so controls are reachable. |
| NVDA with Firefox or Chrome on Windows | Check browse mode for document structure and forms/focus mode for controls. Test announcements as well as operation. |
| VoiceOver with Safari on macOS and iOS | On macOS, use VoiceOver navigation and the rotor. On iOS, use swipe navigation, the rotor, and touch exploration on an actual device. |
| TalkBack with Chrome on Android | Use swipe navigation, reading controls, and touch exploration on an actual device. |
| Browser DevTools and accessibility tree | Inspect computed names, roles, states, relationships, language, focus, DOM order, CSS pixel dimensions, and computed styles. Inspection complements, but does not replace, assistive-technology use. |
| [TPGi Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) | Measure foreground/background contrast, including hover, focus, error, and selected states. Sample the least favorable area of gradients and images. |
| Browser zoom and text-spacing tools | Use browser zoom, text-only resize where available, responsive viewport controls, and a text-spacing bookmarklet or DevTools style overrides. Confirm actual CSS viewport width and computed styles. |
| [axe DevTools](https://www.deque.com/axe/devtools/), [Accessibility Insights](https://accessibilityinsights.io/), or [WAVE](https://wave.webaim.org/) | Find machine-detectable issues and guide inspection. Open dialogs and expose validation, loading, and success states before scanning them. Manually resolve items needing judgment. |
| Optional: axe-core with Playwright or Cypress | Add automated regression checks for representative routes and interactive states. These do not replace keyboard, screen-reader, visual, or media checks. |

## Keyboard navigation

Use the [keyboard navigation checklist](./accessibility-keyboard-navigation.md) for complete keyboard-only journeys, focus order, traps, modal restoration, visible and unobscured focus, bypass navigation, hover/focus content, pointer alternatives, target size, shortcuts, and pointer cancellation.

## Screen readers

Use the [screen reader checklist](./accessibility-screen-readers.md) for semantics, reading order, accessible names/roles/states, visible labels, image alternatives, links/headings, status messages, and language.

## Color contrast and visual presentation

Use the [color contrast and visual presentation checklist](./accessibility-color-contrast.md) for text/non-text contrast, non-color cues, 200% text resize, 320 CSS pixel reflow, orientation, and text-spacing overrides.

## Forms and authentication

Use the [forms and authentication checklist](./accessibility-forms-authentication.md) for labels/groups, input purpose, errors, predictability, important submissions, redundant entry, authentication, time limits, and consistent help.

## Media

Use the [media checklist](./accessibility-media.md) for prerecorded/live captions, audio description, standalone alternatives, player controls, autoplay/movement, and flashing.

## Close out the audit

Record scope and coverage gaps alongside the findings, including unsupported combinations, untested states, and unavailable live events. Prioritize by user impact and whether someone can complete the journey, not only by scanner severity. Retest fixes in the original environment and check related components and full processes for regressions.

Report only what the evidence supports: for example, "these checks passed for this build, scope, and environment," not "WCAG certified." Revisit the full standard for requirements not covered here before making any conformance claim.
