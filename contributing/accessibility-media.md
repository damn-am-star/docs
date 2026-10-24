# Media accessibility checklist

Use this manual-first checklist for audio, video, players, and automatically changing content. WCAG 2.2 Level AA includes both Level A and Level AA criteria. Expected results below describe those requirements unless marked **Recommended**; testing methods and tool choices are recommendations, not mandated implementations.

This is guidance, not an audit report, an exhaustive conformance assessment, or certification. Passing these checks or an automated scan does not establish conformance. Consult the [WCAG 2.2 standard](https://www.w3.org/TR/WCAG22/) and [quick reference](https://www.w3.org/WAI/WCAG22/quickref/) for complete requirements and exceptions.

## Prepare and record

Inventory prerecorded and live synchronized media, standalone audio, silent video, animation, and auto-updating content. Cover representative players and complete viewing journeys across desktop/mobile layouts, fullscreen, captions/description enabled, loading, error, and playback states. Review complete recordings; sample live events representatively and document coverage limits. Avoid repeated exposure to potentially flashing material and refer suspect content for qualified analysis.

Record **Pass**, **Fail**, or **Not applicable** with a reason per check, item, and state. Leave untested checks unassessed and list them as coverage gaps, including unavailable live events. Include URL/build, media version, timestamps, role, OS/browser/assistive-technology versions, input method, viewport, zoom, reproduction steps, expected/actual behavior, and evidence without sensitive data. Retest revised media and player controls. The [audit overview](./manual-accessibility-checklist.md#record-results) has a reusable recording template and links to the other four categories.

## Tools

| Tool | Use |
| --- | --- |
| Player caption/description controls and transcript | Compare captions with speech and meaningful sounds; listen without viewing to assess description; check alternatives against the complete item. A transcript alone does not satisfy 1.2.5. |
| Keyboard alone | Operate all provided player controls, including captions/description and fullscreen, without a pointer. |
| Screen readers | Use NVDA with Firefox/Chrome on Windows, VoiceOver with Safari on macOS/iOS, or TalkBack with Chrome on Android to inspect player names, states, and operation. |
| Browser DevTools and accessibility tree | Inspect player-control names, roles/states, focus, and automatically playing content; confirm actual behavior with manual operation. |
| Qualified flash-analysis tool or specialist | Evaluate suspect rendered media against the standard's general-flash and red-flash definitions; avoid guessing based on a casual viewing. |
| axe DevTools, Accessibility Insights, or WAVE | Complement manual checks with scans of player states. Scans cannot judge caption accuracy, equivalent descriptions, or safe flashing thresholds. |
| Optional axe-core with Playwright/Cypress | Add player-semantics regression scans and control assertions; retain full manual media review. |

## Checks

| Check | Manual steps | Expected pass result and criteria |
| --- | --- | --- |
| Prerecorded captions | Play prerecorded video with audio and turn captions on. Compare the whole recording with speech, speakers, and meaningful sounds. | Synchronized captions provide equivalent speech and relevant non-speech audio, including speaker identification where needed. Media that is a clearly labeled alternative for text has an exception. **1.2.2 Captions (Prerecorded) (A)**. Automatic captions need human review and correction. |
| Live captions | Observe a representative live synchronized stream with captions enabled, including speaker changes and important sounds. | Captions convey the live audio information in synchronized media. **1.2.4 Captions (Live) (AA)**. **Recommended:** assess caption accuracy and latency with actual users. |
| Audio description | Listen to prerecorded synchronized video without viewing it. Identify meaningful visual action, on-screen text, and scene changes absent from the main audio; enable the described version. | Audio description conveys needed visual information. If all meaningful visuals are already conveyed by the soundtrack, additional description is unnecessary. A transcript alone does **not** satisfy **1.2.5 Audio Description (Prerecorded) (AA)**. The Level A alternative in **1.2.3 (A)** permits audio description or a time-based media alternative, with a labeled text-alternative exception; that does not remove the AA description requirement. |
| Standalone audio/video alternatives | Inspect prerecorded audio-only and silent video-only content, including its alternative. | Audio-only has an equivalent time-based media alternative, typically a transcript; video-only has an equivalent time-based media alternative or audio track. Clearly labeled media alternatives for existing text are excepted. **1.2.1 Audio-only and Video-only (Prerecorded) (A)**. **Recommended:** provide a descriptive transcript alongside synchronized media too. |
| Player operation | Use only the keyboard, then a screen reader, to play/pause, seek, change volume, toggle captions/description, and enter/exit fullscreen where provided. | Available controls are keyboard-operable, named, expose states, have visible focus, and create no keyboard trap. **2.1.1 (A), 2.1.2 (A), 2.4.7 (AA), 4.1.2 (A)**. Native players still need evaluation in supported environments. |
| Autoplay audio and movement | Load pages and trigger moving, blinking, scrolling, and auto-updating content. Locate pause/stop/hide and volume controls without using a pointer. | Automatically playing audio lasting more than **3 seconds** can be paused/stopped or its volume controlled independently of system volume. Moving/blinking/scrolling content that starts automatically, lasts more than **5 seconds**, and appears alongside other content can be paused/stopped/hidden unless essential. Automatically updating content alongside other content can be paused/stopped/hidden or its update frequency controlled unless essential; it has no five-second exemption. **1.4.2 Audio Control (A), 2.2.2 Pause, Stop, Hide (A)**. **Recommended:** avoid autoplay audio and honor reduced-motion preferences; reduced-motion support alone does not satisfy these criteria. |
| Flashing | Identify flashing video, animations, and transitions. Do not repeatedly watch suspect material; use qualified analysis of the rendered content when needed. | Nothing flashes more than **three times in any one-second period**, or flashes remain below the general-flash and red-flash thresholds. Thresholds depend on luminance/color changes and combined flashing area, not just frequency: use the standard's definitions and qualified analysis rather than a visual guess. **2.3.1 Three Flashes or Below Threshold (A)**. **Recommended:** avoid flashing entirely. |
