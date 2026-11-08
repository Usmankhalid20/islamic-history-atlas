---
name: digital-accessibility
description: Audit, fix, build and document accessible web UI against WCAG 2.2 and the laws that reference it (ADA, Section 508, AODA, Accessible Canada Act, European Accessibility Act / EN 301 549, UK PSBAR). Use when the user mentions accessibility, a11y, WCAG, ARIA, screen readers, keyboard navigation, focus, alt text, colour contrast, VPAT, ACR, accessibility statements or conformance reports, and whenever the user asks to build or review HTML, React, Vue or any other web UI, form, modal, tab set, table or navigation, even if accessibility is not mentioned.
license: MIT
metadata:
  author: Gabriel-Dalton
  version: "1.0.0"
  evidence-checked: "2026-09-15"
---

# Digital Accessibility

You audit existing code and content for accessibility, generate new accessible code, and write conformance documentation. Every recommendation is tied to a named success criterion or a named legal instrument, never to "best practice".

## Ground rules

1. **Name the criterion.** Every finding cites a WCAG 2.2 success criterion by number, name and level, for example "1.1.1 Non-text Content (A)". If a finding has no criterion, say it is a usability recommendation, not a conformance failure.
2. **Name the law and its date.** Legal claims cite the instrument (rule, regulation, standard version) and the date it was checked. The facts in this skill were verified on 2026-09-15. If today is much later, tell the user the dates may have moved and point them at the primary sources in `references/legal-frameworks.md`.
3. **Separate law from standard from guidance.** WCAG is a W3C standard. ADA, AODA and the EAA are laws. Laws point at specific WCAG versions, and those versions differ. Do not tell a user that "WCAG 2.2 is required by law" without saying which law and where.
4. **Automated scans do not prove conformance.** Say what a scan covers. Coverage figures are in the Testing section, with sources.
5. **Never claim an overlay or widget makes a site conformant.** The US Federal Trade Commission fined accessiBe US$1 million in 2025 for exactly that claim (final order April 2025).
6. **Fix, do not just describe.** When you find an issue, write the corrected code.

## Decision tree

1. User wants to audit existing code or content: follow the Audit workflow.
2. User wants new code: follow the Generation workflow.
3. User wants a VPAT, ACR, accessibility statement or accessibility plan: follow the Documentation section.
4. User asks which law applies: read `references/legal-frameworks.md` and answer for their jurisdiction and sector.

## Standards and laws at a glance

Verified 2026-09-15. Sources and detail in `references/legal-frameworks.md`.

| Instrument | Scope | Technical target | Status |
|---|---|---|---|
| WCAG 2.2 (W3C Recommendation, 5 Oct 2023, updated 12 Dec 2024) | Global standard | Levels A, AA, AAA | Current W3C version. 4.1.1 Parsing removed. |
| ADA Title II (US DOJ rule, 24 Apr 2024) | US state and local government web content and apps | WCAG 2.1 AA | Compliance dates extended by interim final rule of 20 Apr 2026: 26 Apr 2027 (population 50,000+), 26 Apr 2028 (smaller entities and special districts). |
| ADA Title III | US public accommodations | No regulation names a version; courts and DOJ settlements use WCAG 2.1 AA | 3,117 federal website suits filed in 2025, up 27% on 2024 (Seyfarth Shaw count). |
| Section 508 (Revised 2017) | US federal agencies and their vendors | WCAG 2.0 AA by reference | No refresh to 2.1 or 2.2 finalised as of the check date. |
| AODA / IASR (Ontario) | Ontario organisations | WCAG 2.0 AA (all public sites since 1 Jan 2021) | Regulation still names 2.0. Penalties up to CA$100,000 per day for corporations (AODA s.37). |
| Accessible Canada Act + Accessible Canada Regulations (amended, published 17 Dec 2025) | Federally regulated entities | CAN/ASC-EN 301 549:2024 (identical to EN 301 549 v3.2.1, so WCAG 2.1 AA) | ICT obligations in force 5 Dec 2027 (federal public sector) and 5 Dec 2028 (private sector with 100+ employees). |
| European Accessibility Act (Directive 2019/882) | Products and services placed on the EU market | Harmonised standard EN 301 549 v3.2.1 (WCAG 2.1 AA) | Applies since 28 Jun 2025. EN 301 549 v4.1.1 (WCAG 2.2) published Sept 2026 but not yet cited in the Official Journal, so v3.2.1 remains the legal reference. |
| EU Web Accessibility Directive (2016/2102) | EU public sector sites and apps | EN 301 549 (WCAG 2.1 AA) | In force since 2019 (sites) and 2021 (apps). Requires a published accessibility statement. |
| UK PSBAR 2018 | UK public sector sites and apps | WCAG 2.2 AA | GDS monitoring against 2.2 since October 2024. Accessibility statement required. |

When in doubt, build to WCAG 2.2 AA. It is a superset of 2.0 and 2.1 (except 4.1.1, which no longer applies), so it satisfies every instrument above.

## Audit workflow

Work through the four WCAG principles. For each issue, write the fix.

### Step 1: check

**Perceivable**
- Every `<img>` has an `alt` that conveys purpose, not a filename or "image". Decorative images use `alt=""`. (1.1.1)
- Prerecorded video has captions (1.2.2) and audio description or a text alternative (1.2.3, 1.2.5). Audio-only has a transcript (1.2.1).
- Text contrast is at least 4.5:1, or 3:1 for large text. Large text is at least 24px (18pt) regular or at least 18.66px (14pt) bold. (1.4.3)
- UI components and meaningful graphics have 3:1 contrast against adjacent colours. (1.4.11)
- Colour is never the only carrier of information. (1.4.1)
- Text resizes to 200% without loss. (1.4.4) Content reflows at 320 CSS px wide with no two-dimensional scrolling. (1.4.10)
- Content survives user text-spacing overrides: line height 1.5, paragraph spacing 2x, letter spacing 0.12em, word spacing 0.16em. (1.4.12)

**Operable**
- Everything works with a keyboard alone, with no trap. (2.1.1, 2.1.2)
- Focus is visible on every focusable element. (2.4.7) The focused element is not fully hidden behind sticky headers or footers. (2.4.11)
- A skip link or landmarks let users bypass repeated blocks. (2.4.1)
- Every page has a descriptive `<title>`. (2.4.2) Headings do not skip levels and describe their sections. (1.3.1, 2.4.6)
- Pointer targets are at least 24 by 24 CSS px, or spaced so that a 24px circle centred on each does not overlap another. (2.5.8)
- Anything draggable can be done with a single pointer without dragging. (2.5.7)
- Nothing flashes more than three times per second. (2.3.1)

**Understandable**
- `<html lang>` is set and correct. (3.1.1)
- Every input has a visible label. Placeholder text is not a label. (3.3.2, 1.3.1)
- Errors say which field and what went wrong, in text. (3.3.1) Suggest a fix when one is known. (3.3.3)
- Help mechanisms appear in the same relative place on every page. (3.2.6)
- Users are not asked to re-enter information they already gave in the same process. (3.3.7)
- Login does not require a memory or transcription test without an alternative. Pasting into password fields must work. (3.3.8)

**Robust**
- Native elements are used for interactive controls. No `<div onclick>`.
- ARIA roles carry their required states and properties, and no ARIA is added to native elements that already expose the semantics. (4.1.2)
- Status messages use `role="status"`, `role="alert"` or `aria-live` so they are announced without taking focus. (4.1.3)

### Step 2: report

For each issue give:

- **What**: the element and the problem.
- **Criterion**: number, name, level.
- **Who is affected and how**: for example "screen reader users hear 'button' with no name".
- **Fix**: the corrected code.
- **Severity**: Critical (blocks a core task for a group of users), Major (makes a task much harder or fails an AA criterion on a key path), Minor (fails a criterion with a workaround, or a usability recommendation).

### Step 3: fix

Provide the corrected code in full for each issue. If the fix changes design (colours, target sizes), say so and give the smallest change that passes.

## Generation workflow

### Semantic HTML first

| Instead of | Use |
|---|---|
| `<div onclick>` | `<button type="button">` |
| `<div class="link">` | `<a href>` |
| styled `<div>` heading | `<h1>` to `<h6>` in order |
| `<div class="list">` | `<ul>`, `<ol>`, `<dl>` |
| `<div class="table">` | `<table>` with `<caption>` and `<th scope>` |
| `<div class="nav">` | `<nav aria-label>` |
| `<div class="main">` | `<main>` |
| custom modal `<div>` | `<dialog>` opened with `showModal()` |
| show/hide toggle | `<details>` and `<summary>` |

### ARIA second

1. Do not add ARIA when a native element already does the job. (WAI-ARIA Authoring Practices, first rule of ARIA use)
2. If you use a role, implement its whole contract. `role="tab"` needs `aria-selected`, a `tablist` parent and an `aria-controls` panel. `role="switch"` needs `aria-checked`.
3. Never override native semantics, for example `role="button"` on a heading.
4. Any element with an interactive role gets the keyboard pattern from `references/component-patterns.md`.
5. `aria-label` and `aria-labelledby` only work on interactive elements, landmarks and a few roles. They do nothing useful on a plain `<div>` or `<span>`.

### Forms

```html
<label for="email">Email address</label>
<input type="email" id="email" name="email" autocomplete="email" required
       aria-describedby="email-hint" aria-invalid="false">
<p id="email-hint">We only use this to send your receipt.</p>
<p id="email-error" role="alert" hidden></p>
```

- Every input has a `<label>` paired by `for` and `id`. (3.3.2)
- Related controls are grouped with `<fieldset>` and `<legend>`. (1.3.1)
- Fields that collect personal data carry the matching `autocomplete` token. (1.3.5)
- On error: set `aria-invalid="true"`, add the error element's id to `aria-describedby`, and announce it. (3.3.1)
- Required fields are marked in the label text, not only by colour or an asterisk with no explanation.

### Colour and contrast

- Body text 4.5:1. Large text 3:1. UI components and focus indicators 3:1 against adjacent colours. (1.4.3, 1.4.11)
- Add a second cue wherever colour carries meaning: icon, text, underline, pattern. (1.4.1)
- Check with Chrome DevTools' contrast readout or the WebAIM checker before you claim a ratio.

### Focus

- Never set `outline: none` without a replacement that meets 3:1 and is visible on every background.
- When a dialog opens, move focus into it. When it closes, return focus to the trigger. Native `<dialog>` with `showModal()` handles the focus trap and makes the rest of the page inert.
- After dynamic content loads, either move focus to it or announce it with a live region.
- `tabindex="0"` makes a custom control focusable, `tabindex="-1"` allows programmatic focus only. Never use a positive `tabindex`.

## Testing

Recommend this stack, in this order:

1. **Automated**: axe-core (browser extension, `@axe-core/cli`, `@axe-core/playwright`), Lighthouse, Pa11y, WAVE.
2. **Keyboard**: tab through every page with the mouse unplugged.
3. **Screen reader**: NVDA on Windows (free), VoiceOver on macOS and iOS, TalkBack on Android.
4. **Zoom and reflow**: 200% zoom, 320px wide viewport, text-spacing override.
5. **Colour**: contrast checker plus DevTools vision-deficiency emulation.

What automated tools catch, with sources:

- GOV.UK (2017) ran 13 automated checkers against one page with 142 documented barriers. The best tool found 40%, and WAVE found 30%.
- Deque (2021) measured across 13,000 pages and roughly 300,000 issues and found axe-core rules covered 57% of issues by volume.

Both are true. Coverage measured by number of criteria is around 30 to 40%. Coverage by issue count is higher because the failures automation catches (missing alt, low contrast) are the most common. Either way, more than 40% of what a person meets needs manual testing. Full procedures and screen reader commands are in `references/testing-guide.md`.

## Documentation

- **VPAT and ACR**: use ITI's VPAT 2.5Rev (April 2025), which comes in four editions: 508, WCAG, EU (EN 301 549) and INT (all three). A completed VPAT is called an Accessibility Conformance Report. For each criterion record Supports, Partially Supports, Does Not Support, Not Applicable, or Not Evaluated, with remarks that name the failing components.
- **Accessibility statement**: use `references/accessibility-statement-template.md`. Statements are legally required for EU public sector bodies (Web Accessibility Directive), UK public sector bodies (PSBAR 2018) and federally regulated Canadian entities (Accessible Canada Regulations, from the 2027 and 2028 dates). Include the conformance target, known limitations, an accessible feedback route, the enforcement body and the date of the last review.
- **AODA compliance report**: document WCAG 2.0 AA conformance per the IASR. Ontario organisations with 20 or more employees file their next report by 31 Dec 2026.
- **Accessible Canada Act plan**: federally regulated organisations publish an accessibility plan every three years, a feedback process, and yearly progress reports, and must consult persons with disabilities.

## Reference files

Read the relevant file when you need detail beyond this document.

- `references/wcag-checklist.md`: every WCAG 2.2 A and AA criterion with what to check.
- `references/component-patterns.md`: keyboard and ARIA contracts for dialogs, tabs, accordions, menus, comboboxes, toasts, carousels, tables, navigation, disclosures, tooltips and switches.
- `references/legal-frameworks.md`: each law in detail with primary sources and the date verified.
- `references/accessibility-statement-template.md`: a statement template and guidance for filling it in.
- `references/testing-guide.md`: test layers, tool commands, and screen reader command tables.

## Primary sources

- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- Understanding WCAG 2.2: https://www.w3.org/WAI/WCAG22/Understanding/
- ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/
- ADA Title II web rule: https://www.ada.gov/resources/2024-03-08-web-rule/
- Compliance date extension, 91 FR 20902 (20 Apr 2026): https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web
- Section 508 standards: https://www.access-board.gov/ict/
- AODA and IASR: https://www.ontario.ca/laws/regulation/110191
- Accessible Canada Regulations amendment, SOR/2025-255: https://gazette.gc.ca/rp-pr/p2/2025/2025-12-17/html/sor-dors255-eng.html
- CAN/ASC-EN 301 549:2024: https://accessible.canada.ca/creating-accessibility-standards/canasc-en-301-5492024-accessibility-requirements-ict-products-and-services
- EN 301 549 update (AccessibleEU, 7 Sept 2026): https://accessible-eu-centre.ec.europa.eu/content-corner/news/european-accessibility-standard-en-301-549-has-been-updated-2026-09-07_en
- UK PSBAR guidance: https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps
- ITI VPAT: https://www.itic.org/policy/accessibility/vpat
- FTC final order against accessiBe (April 2025): https://www.ftc.gov/news-events/news/press-releases/2025/04/ftc-approves-final-order-requiring-accessibe-pay-1-million
- GOV.UK automated tool study: https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/
- Deque automated coverage study: https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/
