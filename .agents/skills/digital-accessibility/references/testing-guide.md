# Accessibility Testing Guide

Methodology and practical commands for testing digital accessibility.

## Table of Contents
- [Testing Layers](#testing-layers)
- [Automated Testing Tools](#automated-testing-tools)
- [Keyboard Testing](#keyboard-testing)
- [Screen Reader Testing](#screen-reader-testing)
- [Visual Testing](#visual-testing)
- [Mobile Testing](#mobile-testing)
- [Common Test Scenarios](#common-test-scenarios)

---

## Testing Layers

Accessibility testing works in layers. No single layer catches everything:

| Layer | Catches | Misses |
|-------|---------|--------|
| Automated tools | Missing alt text, low contrast, missing labels, invalid ARIA, missing lang attribute | Whether alt text is meaningful, logical reading order, keyboard usability, whether content makes sense |
| Keyboard testing | Keyboard traps, unreachable controls, missing focus indicators, illogical focus order | Screen reader announcements, ARIA correctness, content meaning |
| Screen reader testing | Bad announcements, missing context, broken ARIA, confusing reading order | Visual issues, color contrast, layout problems |
| Manual visual review | Color-only communication, tiny touch targets, text spacing issues, content reflow | Programmatic issues invisible to sighted users |
| User testing with people with disabilities | Real-world usability problems that no checklist catches | (Most comprehensive but most resource-intensive) |

**What automated tools catch, with sources (checked 2026-09-15):**

- GOV.UK (2017) ran 13 automated checkers against one page with 142 documented barriers. The best tool found 40%, and WAVE found 30%. https://accessibility.blog.gov.uk/2017/02/24/what-we-found-when-we-tested-tools-on-the-worlds-least-accessible-webpage/
- Deque (2021) analysed about 13,000 pages and 300,000 issues from real audits and found axe-core rules fully covered 57% of issues by count. https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/

The two numbers measure different things. By criteria covered, automation reaches roughly 30 to 40%. By issue volume it can reach 57% because the failures it catches (missing alt, low contrast) are the most common. Under either measure, a large share of barriers needs manual testing. Always tell users this.

---

## Automated Testing Tools

### axe-core (Recommended)
- Browser extension: axe DevTools (Chrome, Firefox, Edge)
- CLI: `npx @axe-core/cli https://example.com`
- Integration: `npm install axe-core` for unit/integration tests
- In Playwright: `@axe-core/playwright`
- In Cypress: `cypress-axe`

### Lighthouse (Built into Chrome)
- Chrome DevTools → Lighthouse tab → check "Accessibility"
- CLI: `npx lighthouse https://example.com --only-categories=accessibility`
- CI: `lighthouse-ci`

### Pa11y
- CLI: `npx pa11y https://example.com`
- CI-friendly; runs the HTML_CodeSniffer or axe-core rule sets
- Dashboard: `pa11y-dashboard` for monitoring over time

### WAVE
- Browser extension or web service: wave.webaim.org
- Good for visual overlay of issues on the page

### When to Use What
- **During development**: axe-core in tests (CI/CD integration)
- **Code review**: axe DevTools browser extension for quick checks
- **Audit reports**: Lighthouse for scores + axe for detailed issue list
- **Monitoring**: Pa11y dashboard for tracking conformance over time

---

## Keyboard Testing

### Basic Keyboard Test Procedure

1. Put your mouse aside. Seriously: don't touch it.
2. Start at the browser address bar and press **Tab**.
3. Tab through the entire page. Check:
   - Can you see where focus is at all times? (visible focus indicator)
   - Does focus move in a logical, predictable order?
   - Can you reach every interactive element?
   - Can you skip past repeated navigation? (skip link)
4. Test every interactive element:
   - Links: Enter activates
   - Buttons: Enter or Space activates
   - Checkboxes: Space toggles
   - Radio buttons: Arrow keys move between options
   - Select dropdowns: Arrow keys navigate, Enter selects
   - Modals: Tab is trapped inside, Escape closes, focus returns to trigger
   - Tabs: Arrow keys move between tabs
   - Menus: Arrow keys navigate, Enter selects, Escape closes
5. Check for keyboard traps: can you always Tab away from every element?

### Key Commands Reference

| Key | Expected Behavior |
|-----|-------------------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate link or button |
| Space | Activate button, toggle checkbox, scroll page |
| Arrow keys | Navigate within widgets (tabs, menus, radios, sliders) |
| Escape | Close modal/dialog/menu, cancel |
| Home / End | First/last item in a list or widget |

---

## Screen Reader Testing

### VoiceOver (macOS: built-in)

**Start/Stop**: Cmd+F5 (or hold the Touch ID button on supported Macs)

| Action | Command |
|--------|---------|
| Read next item | VO+Right Arrow (VO = Ctrl+Option) |
| Read previous item | VO+Left Arrow |
| Activate (click) | VO+Space |
| Read all from current position | VO+A |
| Open rotor (headings, links, landmarks) | VO+U |
| Navigate by heading | VO+Cmd+H |
| Navigate by link | VO+Cmd+L |
| Navigate by form control | VO+Cmd+J |
| Navigate by landmark | VO+Cmd+; (semicolon) |

### NVDA (Windows: free, download from nvaccess.org)

**Start**: Run NVDA from start menu. **Stop**: Insert+Q.

| Action | Command |
|--------|---------|
| Read next item | Down Arrow |
| Read previous item | Up Arrow |
| Activate (click) | Enter or Space |
| Read all from current position | Insert+Down Arrow |
| Elements list (headings, links, landmarks) | Insert+F7 |
| Navigate by heading | H (in browse mode) |
| Navigate by link | K (unvisited), V (visited) |
| Navigate by form control | F (form field), B (button) |
| Navigate by landmark | D |
| Toggle browse/focus mode | Insert+Space |

### TalkBack (Android: built-in)

| Action | Gesture |
|--------|---------|
| Read next item | Swipe right |
| Read previous item | Swipe left |
| Activate | Double-tap |
| Scroll | Two-finger swipe |
| Open TalkBack menu | Three-finger tap |
| Navigate by headings/links/controls | Swipe up/down to change navigation mode, then swipe right/left |

### What to Listen For

When testing with a screen reader, check:
- **Images**: Are they announced with meaningful descriptions? Are decorative images silent?
- **Headings**: Can you navigate by heading? Do they form a logical outline?
- **Links**: Is the link purpose clear from the announcement? (Not "click here")
- **Forms**: Are labels announced when you enter each field? Are required fields indicated? Are errors announced?
- **Buttons**: Are they announced as buttons with their name and state?
- **Landmarks**: Can you navigate by landmark (main, nav, header, footer)?
- **Dynamic content**: Are live region updates announced? (toasts, errors, loading states)
- **Modals**: Is the background content hidden? Is focus trapped?
- **Tables**: Are headers announced when navigating cells?

---

## Visual Testing

### Color Contrast
- **WebAIM Contrast Checker**: webaim.org/resources/contrastchecker
- **Browser DevTools**: Chrome DevTools → inspect element → hover over color value to see contrast ratio
- **Figma plugin**: Stark, A11y - Color Contrast Checker

### Color Blindness Simulation
- Chrome DevTools → Rendering tab → "Emulate vision deficiencies"
- Options: protanopia, deuteranopia, tritanopia, achromatopsia, blurred vision

### Zoom and Reflow
1. Set browser zoom to 200%. Does all content remain visible and usable?
2. Set viewport width to 320px. Does content reflow to a single column? Is there horizontal scrolling?
3. Override text spacing (DevTools or browser extension): line-height 1.5×, paragraph spacing 2×, letter-spacing 0.12em, word-spacing 0.16em. Does any content get cut off?

### Reduced Motion
- Test with `prefers-reduced-motion: reduce` enabled.
- macOS: System Settings → Accessibility → Display → Reduce motion
- Windows: Settings → Accessibility → Visual effects → Animation effects off

---

## Mobile Testing

### Touch Targets
- Minimum 24×24 CSS pixels, or enough spacing that a 24px circle on each target does not overlap another (2.5.8 Target Size (Minimum), AA).
- 44×44 CSS pixels is the AAA criterion (2.5.5 Target Size (Enhanced)) and the figure used by Apple and Google platform guidelines.
- Check spacing between adjacent targets.

### Orientation
- Test in both portrait and landscape. Content should not be restricted to one orientation unless essential.

### Screen Reader
- iOS: VoiceOver (Settings → Accessibility → VoiceOver)
- Android: TalkBack (Settings → Accessibility → TalkBack)
- Test gestures: swipe navigation, double-tap activation, explore by touch.

---

## Common Test Scenarios

Use these scenarios as a starting point for manual testing:

1. **Complete a purchase / submit a form** using only the keyboard.
2. **Navigate to a specific page** using only the screen reader's heading navigation.
3. **Read and understand a data table** with a screen reader.
4. **Recover from a form error**: is the error announced? Can you find and fix the field?
5. **Use a date picker** with only the keyboard.
6. **Watch a video**: are captions available and accurate?
7. **Use the site at 200% zoom**: can you still complete all tasks?
8. **Use the site on mobile**: are touch targets large enough? Does everything work in both orientations?
9. **Open and close a modal dialog**: does focus move correctly? Is background content inert?
10. **Use the search/autocomplete**: are suggestions announced? Can you select one with the keyboard?
