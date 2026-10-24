# Color contrast and visual presentation accessibility checklist

Use this manual-first checklist for contrast, text resizing, and responsive visual presentation. WCAG 2.2 Level AA includes both Level A and Level AA criteria. Expected results below describe those requirements unless marked **Recommended**; testing methods and tool choices are recommendations, not mandated implementations.

This is guidance, not an audit report, an exhaustive conformance assessment, or certification. Passing these checks or an automated scan does not establish conformance. Consult the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) and [quick reference](https://www.w3.org/WAI/WCAG22/quickref/) for complete requirements and exceptions.

## Prepare and record

Select representative pages and complete journeys across desktop/mobile layouts, portrait/landscape, all relevant themes, and hover, focus, selected, loading, error, and success states. Use safe test data. Complete journeys after changing zoom or spacing to find clipped controls and lost functionality, not just visual differences.

Record **Pass**, **Fail**, or **Not applicable** with a reason per check, page, and state. Leave untested checks unassessed and list them as coverage gaps. Include URL/build, role, OS/browser versions, input method, viewport in CSS pixels, zoom, theme, reproduction steps, expected/actual behavior, and evidence such as measured ratios, computed colors, text sizes, and screenshots without secrets. Retest fixes at the original settings. The [audit overview](./manual-accessibility-checklist.md#record-results) has a reusable recording template and links to the other four categories.

## Tools

| Tool | Use |
| --- | --- |
| [TPGi Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) | Measure actual foreground/background colors, including gradients, image backgrounds, and interaction states. Use the least favorable relevant area. |
| Browser DevTools | Inspect computed colors, text size/weight, CSS pixel viewport size, and target states. Inspect images of text and contrast exceptions manually. |
| Browser zoom and responsive viewport controls | Test 200% text resize and 320 CSS pixel reflow, verifying actual dimensions. Test orientation on supported devices. |
| Text-spacing bookmarklet or DevTools style overrides | Apply all four spacing overrides together; inspect computed styles and complete the journey. |
| Keyboard | Reach focus states and ensure controls remain visible and operable after resizing and spacing changes. |
| axe DevTools, Accessibility Insights, or WAVE | Supplement measurement with automated contrast checks. Manually check gradients/images, non-text states, non-color cues, and issues scanners cannot resolve. |
| Optional axe-core with Playwright/Cypress | Scan representative states for regressions; retain manual contrast measurements and resize/spacing checks. |

## Checks

| Check | Manual steps | Expected pass result and criteria |
| --- | --- | --- |
| Text contrast | Measure text against its actual background in every theme and interaction state, including placeholders and text over images. | At least **4.5:1** for normal text, or **3:1** for large text: at least **18 pt (24 CSS px)** regular or **14 pt (about 18.67 CSS px)** bold. Logos, incidental text, and text in inactive controls are excepted. Do not round a failing ratio up. **1.4.3 Contrast (Minimum) (AA)**. |
| Non-text contrast | Measure visual information needed to identify controls/states and understand meaningful graphics against adjacent colors. Include focus and selected states where applicable. | Required visual information has at least **3:1** contrast. Inactive controls and unmodified user-agent control appearances are excepted; graphics have an exception where a particular presentation is essential. Not every border or decorative graphic requires 3:1. **1.4.11 Non-text Contrast (AA)**. |
| Non-color cues | Inspect errors, links, charts, and selected states in grayscale or with color removed. Check instructions that mention color, shape, position, or sound. | Color is not the sole means of conveying information, actions, or distinctions; instructions do not depend solely on sensory characteristics. Use text, patterns, shapes, or other cues. **1.4.1 Use of Color (A), 1.3.3 Sensory Characteristics (A)**. |
| Text resize | Increase text size to **200%** using browser zoom or text-only resizing, without assistive technology. Complete the journey and inspect controls and messages. | Text resizes without loss of content or functionality; captions and images of text are excepted. **1.4.4 Resize Text (AA)**. Also check that real text is used rather than images of text unless customizable or essential. **1.4.5 Images of Text (AA)**. |
| Reflow and orientation | Test a viewport **320 CSS pixels wide**, or 400% zoom from an initial 1280 CSS pixel width, verifying the resulting viewport. Test portrait and landscape. | Vertically scrolling content needs no two-dimensional scrolling and loses no information or functionality. For horizontally scrolling content, test a height of **256 CSS pixels**. Parts requiring a two-dimensional layout for meaning or use, such as data tables or maps, are excepted, not the entire page. Orientation is not restricted unless essential. **1.4.10 Reflow (AA), 1.3.4 Orientation (AA)**. |
| Text spacing | Apply all overrides together: line height **1.5 times** font size, paragraph spacing **2 times**, letter spacing **0.12 times**, word spacing **0.16 times**. Inspect navigation, inputs, dialogs, and long text. | No loss of content or functionality from these overrides where the markup supports them. Languages/scripts that do not use a spacing property need only support applicable properties. These are override tolerances, not required default design settings. **1.4.12 Text Spacing (AA)**. |
