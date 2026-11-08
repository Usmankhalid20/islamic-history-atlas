# WCAG 2.2 AA Checklist

Every Level A and AA success criterion in WCAG 2.2 (W3C Recommendation, 5 October 2023, updated 12 December 2024), organised by principle and guideline. Level AAA criteria are not listed. Criterion 4.1.1 Parsing was removed in WCAG 2.2 and, by W3C errata, always passes in 2.0 and 2.1 claims.

Source: https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/Understanding/ (checked 2026-09-15).

## Table of Contents
- [1. Perceivable](#1-perceivable)
- [2. Operable](#2-operable)
- [3. Understandable](#3-understandable)
- [4. Robust](#4-robust)

---

## 1. Perceivable

Information and UI components must be presentable in ways users can perceive.

### 1.1 Text Alternatives

- **1.1.1 Non-text Content (A)**: All non-text content has a text alternative that serves the equivalent purpose.
  - Images: meaningful `alt` text describing the content or function
  - Decorative images: `alt=""` (adding `role="presentation"` is optional), or load them via CSS
  - Complex images (charts, diagrams): short `alt` plus longer description via `aria-describedby` or adjacent text
  - Functional images (buttons, links): `alt` describes the function, not the image
  - Image of text: use actual text instead; if unavoidable, `alt` contains the same text
  - CAPTCHAs: text alternative identifying the purpose plus an alternative form
  - Inputs (type="image"): `alt` describes the button function

### 1.2 Time-Based Media

- **1.2.1 Audio-only and Video-only (A)**: Provide transcript for audio-only; provide transcript or audio description for video-only.
- **1.2.2 Captions (A)**: Synchronized captions for all prerecorded audio in video.
- **1.2.3 Audio Description or Media Alternative (A)**: Audio description or full text alternative for prerecorded video.
- **1.2.4 Captions (Live) (AA)**: Captions for live audio content.
- **1.2.5 Audio Description (AA)**: Audio description for prerecorded video content.

### 1.3 Adaptable

- **1.3.1 Info and Relationships (A)**: Structure and relationships conveyed visually are also conveyed programmatically.
  - Headings use `<h1>`–`<h6>` (not just bold/large text)
  - Lists use `<ul>`, `<ol>`, or `<dl>`
  - Tables use `<th scope="col/row">`, `<caption>`
  - Form fields use `<label>`, `<fieldset>`, `<legend>`
  - Regions use landmark elements: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- **1.3.2 Meaningful Sequence (A)**: Reading order in the DOM matches the visual order.
- **1.3.3 Sensory Characteristics (A)**: Instructions don't rely solely on shape, color, size, visual location, orientation, or sound.
- **1.3.4 Orientation (AA)**: Content not restricted to a single display orientation unless essential.
- **1.3.5 Identify Input Purpose (AA)**: Form fields collecting personal data use appropriate `autocomplete` attributes.

### 1.4 Distinguishable

- **1.4.1 Use of Color (A)**: Color is not the only visual means of conveying info, indicating action, prompting response, or distinguishing elements.
- **1.4.2 Audio Control (A)**: Auto-playing audio longer than 3 seconds can be paused/stopped or volume controlled independently.
- **1.4.3 Contrast (Minimum) (AA)**: Text has at least 4.5:1 contrast ratio. Large text has at least 3:1. Large text means at least 18pt (24px) regular, or at least 14pt (about 18.66px) bold.
- **1.4.4 Resize Text (AA)**: Text resizable up to 200% without assistive technology, without loss of content/functionality.
- **1.4.5 Images of Text (AA)**: Use real text instead of images of text, except logos.
- **1.4.10 Reflow (AA)**: Content reflows at 320px width (for vertical scrolling) and 256px height (for horizontal scrolling) without loss of info. No two-dimensional scrolling.
- **1.4.11 Non-text Contrast (AA)**: UI components and graphical objects have at least 3:1 contrast against adjacent colors.
- **1.4.12 Text Spacing (AA)**: No loss of content/functionality when user overrides: line height 1.5×, paragraph spacing 2×, letter spacing 0.12em, word spacing 0.16em.
- **1.4.13 Content on Hover or Focus (AA)**: Hoverable/focusable additional content is dismissible (Esc or moving pointer), hoverable (user can move pointer over it), and persistent (stays until dismissed or trigger loses hover/focus).

## 2. Operable

UI components and navigation must be operable.

### 2.1 Keyboard Accessible

- **2.1.1 Keyboard (A)**: All functionality available via keyboard (no timing for keystrokes).
- **2.1.2 No Keyboard Trap (A)**: Focus can be moved away from any component using keyboard. If non-standard keys required, the user is informed.
- **2.1.4 Character Key Shortcuts (A)**: If single-character key shortcuts exist, they can be turned off, remapped, or are only active on focus.

### 2.2 Enough Time

- **2.2.1 Timing Adjustable (A)**: Time limits can be turned off, adjusted, or extended (with warning and at least 20 seconds to act, up to 10 times).
- **2.2.2 Pause, Stop, Hide (A)**: Moving, blinking, scrolling, or auto-updating content can be paused, stopped, or hidden.

### 2.3 Seizures and Physical Reactions

- **2.3.1 Three Flashes or Below Threshold (A)**: No content flashes more than 3 times per second (or flash is below general and red flash thresholds).

### 2.4 Navigable

- **2.4.1 Bypass Blocks (A)**: Mechanism to skip repeated blocks of content (skip links, landmarks, headings).
- **2.4.2 Page Titled (A)**: Pages have descriptive, unique `<title>` elements.
- **2.4.3 Focus Order (A)**: Focus order preserves meaning and operability (generally matches visual order).
- **2.4.4 Link Purpose (In Context) (A)**: Link purpose determinable from link text alone or link text + its context. No "click here" or "read more" without context.
- **2.4.5 Multiple Ways (AA)**: More than one way to locate a page (nav menu, site map, search, table of contents).
- **2.4.6 Headings and Labels (AA)**: Headings and labels describe topic or purpose.
- **2.4.7 Focus Visible (AA)**: Keyboard focus indicator is visible.
- **2.4.11 Focus Not Obscured (Minimum) (AA)**: [WCAG 2.2] Focused component is not entirely hidden by author-created content (sticky headers, footers, banners).

### 2.5 Input Modalities

- **2.5.1 Pointer Gestures (A)**: Functions using multipoint or path-based gestures can also be operated with a single pointer without a path-based gesture.
- **2.5.2 Pointer Cancellation (A)**: For single-pointer functions: down-event doesn't trigger, up-event triggers or can abort/undo.
- **2.5.3 Label in Name (A)**: Accessible name of UI components with visible text contains the visible text.
- **2.5.4 Motion Actuation (A)**: Functionality triggered by device motion can also be triggered by UI components; motion response can be disabled.
- **2.5.7 Dragging Movements (AA)**: [WCAG 2.2] Functionality that uses dragging can be achieved with a single pointer without dragging.
- **2.5.8 Target Size (Minimum) (AA)**: [WCAG 2.2] Touch/click targets are at least 24×24 CSS pixels, or have sufficient spacing.

## 3. Understandable

Information and UI operation must be understandable.

### 3.1 Readable

- **3.1.1 Language of Page (A)**: Default `lang` attribute on `<html>`.
- **3.1.2 Language of Parts (AA)**: `lang` attribute on elements in a different language than the page default.

### 3.2 Predictable

- **3.2.1 On Focus (A)**: Receiving focus does not trigger a change of context.
- **3.2.2 On Input (A)**: Changing a setting does not trigger a change of context unless the user is informed beforehand.
- **3.2.3 Consistent Navigation (AA)**: Navigation mechanisms repeated across pages appear in the same relative order.
- **3.2.4 Consistent Identification (AA)**: Components with the same function are identified consistently across pages.
- **3.2.6 Consistent Help (A)**: [WCAG 2.2] If help mechanisms (contact info, chatbots, FAQ links) appear on multiple pages, they're in the same relative location.

### 3.3 Input Assistance

- **3.3.1 Error Identification (A)**: Input errors detected automatically are described to the user in text. The specific field is identified.
- **3.3.2 Labels or Instructions (A)**: Labels or instructions provided for user input.
- **3.3.3 Error Suggestion (AA)**: If an error is detected and suggestions are known, they are provided (unless it would compromise security).
- **3.3.4 Error Prevention (Legal, Financial, Data) (AA)**: For pages with legal commitments or financial transactions: submissions are reversible, data is checked and user can correct, or a confirmation mechanism is available.
- **3.3.7 Redundant Entry (A)**: [WCAG 2.2] Info previously entered by the user is auto-populated or selectable: not required to be re-entered (unless essential for security or if the previous entry is no longer valid).
- **3.3.8 Accessible Authentication (Minimum) (AA)**: [WCAG 2.2] Authentication processes don't require cognitive function tests (memorizing, transcribing, calculating) unless an alternative or assistance mechanism is provided.

## 4. Robust

Content must be robust enough for a wide variety of user agents and assistive technologies.

### 4.1 Compatible

- **4.1.1 Parsing**: removed in WCAG 2.2. Do not report parsing errors as a 4.1.1 failure; report the effect under 1.3.1 or 4.1.2 if assistive technology is affected.
- **4.1.2 Name, Role, Value (A)**: All UI components have accessible name and role; states, properties, and values can be programmatically set and change notifications available to user agents.
  - Custom widgets expose correct `role`, `aria-*` states, and keyboard interaction
  - Status messages use `role="status"`, `role="alert"`, or `aria-live`
- **4.1.3 Status Messages (AA)**: Status messages (confirmations, errors, progress, wait) can be determined by assistive tech through role or properties without receiving focus.
