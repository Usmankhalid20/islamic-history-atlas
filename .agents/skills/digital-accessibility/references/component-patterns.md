# Accessible Component Patterns

Keyboard interaction patterns and ARIA requirements for common UI components. Each pattern follows the WAI-ARIA Authoring Practices Guide (APG) page of the same name: https://www.w3.org/WAI/ARIA/apg/patterns/ (checked 2026-09-15). Where a native HTML element exists, it comes first and the ARIA version is the fallback.

## Table of Contents
- [Modal Dialog](#modal-dialog)
- [Tabs](#tabs)
- [Accordion](#accordion)
- [Dropdown Menu](#dropdown-menu)
- [Combobox / Autocomplete](#combobox--autocomplete)
- [Toast / Notification](#toast--notification)
- [Carousel](#carousel)
- [Sortable Data Table](#sortable-data-table)
- [Navigation Menu](#navigation-menu)
- [Disclosure (Show/Hide)](#disclosure-showhide)
- [Tooltip](#tooltip)
- [Switch / Toggle](#switch--toggle)

---

## Modal Dialog

### Native first
```html
<dialog id="confirm" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  <div>...content...</div>
  <button type="button" id="close">Close</button>
</dialog>
<script>
  const dialog = document.getElementById('confirm');
  // showModal() traps focus, makes the rest of the page inert and closes on Escape.
  trigger.addEventListener('click', () => dialog.showModal());
  document.getElementById('close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => trigger.focus());
</script>
```

`<dialog>` with `showModal()` is supported in all current browsers (Baseline since March 2022). Prefer it over a custom dialog.

### ARIA fallback
```html
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Dialog Title</h2>
  <div>...content...</div>
  <button type="button">Close</button>
</div>
```

### Keyboard
| Key | Action |
|-----|--------|
| Tab | Move focus to next tabbable element inside dialog. Focus wraps (focus trap). |
| Shift+Tab | Move focus to previous tabbable element. Wraps. |
| Escape | Close dialog. |

### Focus Management
- On open: move focus to the first focusable element, or the close button, or the dialog itself if no focusable content.
- On close: return focus to the element that triggered the dialog.
- Trap focus inside the dialog while open. Nothing outside the dialog is reachable via Tab.
- For the ARIA fallback, set the `inert` attribute on everything outside the dialog while it is open (or `aria-hidden="true"` for older browsers). Native `showModal()` does this for you.

---

## Tabs

### ARIA
```html
<div role="tablist" aria-label="Section tabs">
  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1" tabindex="0">Tab 1</button>
  <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">Tab 2</button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1" tabindex="0">...content...</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" tabindex="0" hidden>...content...</div>
```

### Keyboard
| Key | Action |
|-----|--------|
| Arrow Left/Right | Move between tabs (horizontal tablist). Activate on move (automatic activation) or on Enter/Space (manual activation). |
| Arrow Up/Down | Move between tabs (vertical tablist). |
| Home | Move to first tab. |
| End | Move to last tab. |
| Tab | Move focus into the active tab panel. |

### Notes
- Only the active tab has `tabindex="0"`; inactive tabs have `tabindex="-1"`.
- `aria-selected="true"` only on the active tab.
- Tab activation can be automatic (select on arrow) or manual (select on Enter/Space). Automatic is preferred unless the tab panel content loads slowly.

---

## Accordion

### ARIA
```html
<div>
  <h3>
    <button aria-expanded="true" aria-controls="section-1" id="header-1">Section 1</button>
  </h3>
  <div id="section-1" role="region" aria-labelledby="header-1">...content...</div>

  <h3>
    <button aria-expanded="false" aria-controls="section-2" id="header-2">Section 2</button>
  </h3>
  <div id="section-2" role="region" aria-labelledby="header-2" hidden>...content...</div>
</div>
```

### Keyboard
| Key | Action |
|-----|--------|
| Enter / Space | Toggle the accordion section. |
| Arrow Down | Move focus to next accordion header. |
| Arrow Up | Move focus to previous accordion header. |
| Home | Move focus to first accordion header. |
| End | Move focus to last accordion header. |

### Notes
- Use real heading elements wrapping the button to maintain heading hierarchy.
- Toggle `aria-expanded` between "true" and "false".
- Decide if multiple sections can be open at once. There is no ARIA requirement for single-open behavior.

---

## Dropdown Menu

### ARIA
```html
<button aria-haspopup="true" aria-expanded="false" aria-controls="menu-1">Options</button>
<ul role="menu" id="menu-1" hidden>
  <li role="menuitem">Edit</li>
  <li role="menuitem">Duplicate</li>
  <li role="separator"></li>
  <li role="menuitem">Delete</li>
</ul>
```

### Keyboard
| Key | Action |
|-----|--------|
| Enter / Space | Open menu, focus first item. |
| Arrow Down | Open menu (from button) or move to next item. |
| Arrow Up | Move to previous item. Wraps to last. |
| Home | Move to first item. |
| End | Move to last item. |
| Escape | Close menu, return focus to button. |
| Character keys | Move to next item starting with that character. |

### Notes
- `role="menu"` is for actions (like a context menu), not for navigation. Navigation uses `<nav>` with links.
- Update `aria-expanded` on the trigger button.
- Focus management: on open, focus the first menuitem; on close, return focus to the trigger.

---

## Combobox / Autocomplete

### ARIA
```html
<label for="search">Search</label>
<input type="text" id="search" role="combobox"
       aria-expanded="false" aria-autocomplete="list"
       aria-controls="results-list" aria-activedescendant="">
<ul role="listbox" id="results-list" hidden>
  <li role="option" id="option-1" aria-selected="false">Result 1</li>
  <li role="option" id="option-2" aria-selected="false">Result 2</li>
</ul>
```

### Keyboard
| Key | Action |
|-----|--------|
| Arrow Down | Open list (if closed) or move to next option. |
| Arrow Up | Move to previous option. |
| Enter | Select the current option. Close list. |
| Escape | Close list without selecting. Clear input or restore previous value. |
| Home / End | Move cursor to beginning/end of input text. |

### Notes
- This is the ARIA 1.2 pattern: `role="combobox"` goes on the `<input>` itself. The older ARIA 1.0 pattern (role on a wrapper `<div>` with `aria-owns`) is deprecated in the APG.
- Use `aria-activedescendant` on the input to indicate the visually focused option (keeps real DOM focus on the input so the user can keep typing).
- Update `aria-expanded` when the list opens/closes.
- Announce the number of results with a live region: "5 results available."

---

## Toast / Notification

### ARIA
```html
<!-- Polite notifications (non-urgent status updates) -->
<div role="status" aria-live="polite">
  Settings saved successfully.
</div>

<!-- Urgent notifications (errors, alerts) -->
<div role="alert" aria-live="assertive">
  Your session will expire in 2 minutes.
</div>
```

### Notes
- Use `role="status"` (polite) for confirmations, progress, non-critical info.
- Use `role="alert"` (assertive) for errors, warnings, time-sensitive info.
- The live region container must exist in the DOM before content is injected.
- Don't move focus to toasts unless they require user action.
- A toast that disappears on a timer is a time limit under 2.2.1 Timing Adjustable unless the same information stays available elsewhere. Either keep a way to re-read it, or let users extend or pause it.
- Provide a mechanism to review past notifications for users who might have missed them.

---

## Carousel

### ARIA
```html
<div aria-roledescription="carousel" aria-label="Featured articles">
  <button aria-label="Previous slide">‹</button>
  <div aria-live="off" role="group" aria-roledescription="slide" aria-label="1 of 5">
    ...slide content...
  </div>
  <button aria-label="Next slide">›</button>
  <div role="tablist" aria-label="Slide controls">
    <button role="tab" aria-selected="true" aria-label="Slide 1">●</button>
    <button role="tab" aria-selected="false" aria-label="Slide 2">○</button>
  </div>
</div>
```

### Keyboard
| Key | Action |
|-----|--------|
| Arrow Left/Right | Navigate slides (when dot indicators are focused). |
| Enter / Space | Activate a slide from dot indicator. |
| Tab | Move between carousel controls. |

### Notes
- When auto-rotating: set `aria-live="off"`. When paused/manual: set `aria-live="polite"`.
- Provide a pause button for auto-rotating carousels.
- Each slide: `role="group"` with `aria-roledescription="slide"` and `aria-label="X of Y"`.

---

## Sortable Data Table

### ARIA
```html
<table>
  <caption>Quarterly Sales Report</caption>
  <thead>
    <tr>
      <th scope="col" aria-sort="ascending">
        <button>Name</button>
      </th>
      <th scope="col" aria-sort="none">
        <button>Revenue</button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Product A</td><td>$50,000</td></tr>
  </tbody>
</table>
```

### Notes
- Use `<caption>` to describe the table.
- Use `<th scope="col">` and `<th scope="row">` for header cells.
- For sortable columns: `aria-sort="ascending"`, `aria-sort="descending"`, or `aria-sort="none"`.
- For complex tables with multi-level headers, use `headers` attribute on `<td>` referencing `<th>` ids.

---

## Navigation Menu

### Pattern
```html
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/" aria-current="page">Home</a></li>
    <li><a href="/about">About</a></li>
    <li>
      <button aria-expanded="false" aria-haspopup="true">Services</button>
      <ul hidden>
        <li><a href="/consulting">Consulting</a></li>
        <li><a href="/training">Training</a></li>
      </ul>
    </li>
  </ul>
</nav>
```

### Notes
- Use `<nav>` element. If multiple navs exist, give each a unique `aria-label`.
- Mark the current page with `aria-current="page"`.
- Submenus: use a `<button>` trigger with `aria-expanded` and `aria-haspopup`.
- Dropdown submenus are navigated with arrow keys.

---

## Disclosure (Show/Hide)

### ARIA
```html
<button aria-expanded="false" aria-controls="details-1">Show details</button>
<div id="details-1" hidden>...content...</div>
```

### Keyboard
| Key | Action |
|-----|--------|
| Enter / Space | Toggle visibility. |

### Notes
- Simplest accessible pattern. Toggle `aria-expanded` and `hidden`.
- Alternatively, use the native `<details>` / `<summary>` elements, which handle everything automatically.

---

## Tooltip

### ARIA
```html
<button aria-describedby="tooltip-1">Settings</button>
<div role="tooltip" id="tooltip-1" hidden>Open application settings</div>
```

### Notes
- Show on hover AND focus. Dismiss on Escape, mouse leave, or focus loss.
- Must meet WCAG 1.4.13: dismissible, hoverable, persistent.
- Tooltip content must be hoverable without it disappearing.
- Use `aria-describedby` for supplementary info, `aria-labelledby` if the tooltip IS the label.
- If information is essential, don't put it in a tooltip: put it in visible text.

---

## Switch / Toggle

### ARIA
```html
<button role="switch" aria-checked="false" aria-label="Dark mode">
  <span aria-hidden="true">Off</span>
</button>
```

### Keyboard
| Key | Action |
|-----|--------|
| Enter / Space | Toggle the switch state. |

### Notes
- Toggle `aria-checked` between "true" and "false".
- Provide a visible label (external `<label>` or `aria-label`).
- Visually indicate the on/off state with more than just color (position, text, icon).
