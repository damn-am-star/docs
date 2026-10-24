# Screen reader accessibility checklist

Use this manual-first checklist to assess web interfaces with screen readers. WCAG 2.2 Level AA includes both Level A and Level AA criteria. Expected results below describe those requirements unless marked **Recommended**; testing methods and tool choices are recommendations, not mandated implementations.

This is guidance, not an audit report, an exhaustive conformance assessment, or certification. Passing these checks or an automated scan does not establish conformance. Consult the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) and [quick reference](https://www.w3.org/WAI/WCAG22/quickref/) for complete requirements and exceptions.

## Prepare and record

Choose representative pages and complete journeys, including sign-in, search, and submission. Cover desktop/mobile layouts, dialogs, expanded menus, loading, empty, error, and success states. Use safe test data and document browser/assistive-technology combinations that were not tested. Read pages linearly before using shortcuts; then operate controls and complete the process.

Record **Pass**, **Fail**, or **Not applicable** with a reason per check, page, and state. Leave untested checks unassessed and list them as coverage gaps. Include URL/build, role, OS/browser/assistive-technology versions, viewport, input method, zoom, theme, reproduction steps, expected/actual behavior, and evidence such as an announcement transcript or accessibility-tree details without secrets. Retest fixes and affected journeys. The [audit overview](./manual-accessibility-checklist.md#record-results) has a reusable recording template and links to the other four categories.

## Tools

| Tool | Use |
| --- | --- |
| NVDA with Firefox or Chrome on Windows | Use browse mode for reading/structure and forms/focus mode for controls. Listen to names, roles, states, and updates. |
| VoiceOver with Safari on macOS/iOS | Use VoiceOver navigation and the rotor on macOS; on iOS use swipe navigation, the rotor, and touch exploration on an actual device. |
| TalkBack with Chrome on Android | Use swipe navigation, reading controls, and touch exploration on an actual device. |
| Browser DevTools and accessibility tree | Inspect computed names, roles, relationships, state changes, DOM order, and language. Inspection cannot substitute for listening and operating the interface. |
| axe DevTools, Accessibility Insights, or WAVE | Scan exposed states for machine-detectable semantics and naming issues; manually assess meaning and real announcements. |
| Optional axe-core with Playwright/Cypress | Add semantic regression scans for representative states; keep manual screen-reader journeys. |

## Checks

| Check | Manual steps | Expected pass result and criteria |
| --- | --- | --- |
| Semantics and reading order | Read each page linearly, then navigate headings, landmarks, lists, and tables. Compare the spoken sequence with the visual meaning and accessibility tree. Repeat in responsive layouts. | Structure and relationships are programmatically determinable; the reading sequence preserves meaning. Table headers associate with the correct cells. **1.3.1 Info and Relationships (A), 1.3.2 Meaningful Sequence (A)**. **Recommended:** use native HTML, a clear heading hierarchy, and useful landmarks. |
| Names, roles, and states | Navigate every control, including icon-only buttons and custom widgets. Activate it and change its state. Inspect its computed accessible name and role. | Name and role are programmatically determinable; user-set states, properties, and values are exposed, and changes are available to assistive technology. Expanded, selected, checked, and disabled states match behavior. **4.1.2 Name, Role, Value (A)**. |
| Visible label matches name | Compare each visible text label with the computed accessible name. Optionally activate controls with speech input using their visible label. | The accessible name contains the visible text label, including text presented as an image. **2.5.3 Label in Name (A)**. **Recommended:** start the name with the visible label. |
| Image alternatives | Read meaningful images, linked images, charts, and decorative images with the screen reader; compare alternatives with the image's purpose in context. | Text alternatives convey equivalent information or function. Decorative images are ignored, not announced as filenames. Complex charts have equivalent information; specialized cases such as tests, sensory experiences, and CAPTCHAs follow the criterion's specific provisions. **1.1.1 Non-text Content (A)**. |
| Links, headings, and page titles | List links and headings, read ambiguous links in their programmatically determined context, and switch between pages or tabs. | Link purpose is understandable from its text alone or its programmatic context, except where ambiguous to users generally. Headings and labels describe topic or purpose; page titles identify topic or purpose. **2.4.4 Link Purpose (In Context) (A), 2.4.6 Headings and Labels (AA), 2.4.2 Page Titled (A)**. **Recommended:** prefer useful standalone link text. |
| Dynamic status messages | Trigger a search result count, loading/progress message, saved confirmation, and validation error without deliberately moving focus. Listen once and inspect updates. | Status messages are programmatically determinable through role or properties so they can be presented without receiving focus. Updates are announced at an appropriate urgency. **4.1.3 Status Messages (AA)**. **Recommended:** avoid duplicate announcements, announcing every keystroke, or moving focus merely to read a routine update. |
| Language | Check the document's language and passages in other languages in the accessibility tree or markup; listen with suitable voices installed. | The page language and changes in passage language are programmatically determinable, except proper names, technical terms, indeterminate language, and words adopted into the surrounding language. **3.1.1 Language of Page (A), 3.1.2 Language of Parts (AA)**. |
