# Implementation Plan: Todo Dashboard

## Overview

A self-contained, client-side productivity dashboard built with plain HTML, CSS, and JavaScript — no build step, no framework, no external dependencies. The implementation is organised into three files: `index.html` (structure), `css/style.css` (design tokens, layout, components), and `js/app.js` (all runtime behaviour). Data is persisted entirely via `localStorage`.

## Tasks

- [x] 1. Project scaffold
  - [x] 1.1 Create `index.html` with `<!DOCTYPE html>`, `<meta charset>`, `<meta name="viewport">`, and `<title>My Dashboard</title>`
    - Link `css/style.css` in `<head>`; add `<script src="js/app.js">` before `</body>`
    - Set `data-theme="light"` on `<html lang="en">`
    - _Requirements: 1.1, 3.1_
  - [x] 1.2 Create `css/style.css` as an empty file with section-comment scaffolding
    - _Requirements: 7.1_
  - [x] 1.3 Create `js/app.js` with `'use strict';` and seven named section comments (Helpers, Clock & Greeting, Theme, Name, Timer, To-Do List, Quick Links)
    - _Requirements: 1.1_

- [x] 2. CSS design tokens and base styles
  - [x] 2.1 Define CSS custom properties on `:root` for the light theme
    - Tokens: `--bg`, `--surface`, `--surface-2`, `--border`, `--text`, `--text-muted`, `--accent` (#5b6af7), `--accent-dark`, `--accent-light`, `--danger`, `--danger-light`, `--success`, `--radius` (12px), `--radius-sm` (8px), `--shadow`, `--shadow-md`, `--transition` (.18s ease), `--font`
    - _Requirements: 3.1, 3.7_
  - [x] 2.2 Define `[data-theme="dark"]` rule block overriding all tokens for the dark palette
    - _Requirements: 3.2, 3.5, 3.7_
  - [x] 2.3 Add CSS reset (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }`) and `body` base styles
    - `body`: `font-family: var(--font)`, `background: var(--bg)`, `color: var(--text)`, `min-height: 100vh`, `transition: background var(--transition), color var(--transition)`
    - _Requirements: 3.7_
  - [x] 2.4 Add button styles: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-sm`, `.icon-btn`
    - _Requirements: 3.5, 4.3, 4.6_
  - [x] 2.5 Add input styles for `input[type="text"]`, `input[type="url"]`, `input[type="number"]`, including focus state (`border-color: var(--accent)`)
    - _Requirements: 5.3, 6.3_

- [x] 3. Header / topbar
  - [x] 3.1 Add `<header class="topbar">` to `index.html` with three child divs: `.topbar-left`, `.topbar-center`, `.topbar-right`
    - `.topbar-left`: `#greeting-text` span, `#user-name.editable-name` span (`title="Click to edit name"`), `#edit-name-btn` icon button
    - `.topbar-center`: `#clock.clock` div, `#date.date-display` div
    - `.topbar-right`: `#theme-toggle.icon-btn` button
    - _Requirements: 1.1, 2.1, 3.3_
  - [x] 3.2 Style `.topbar` (sticky, `z-index: 100`, flex, space-between, shadow, border-bottom, background transition)
    - Style `.topbar-left` (flex, gap, font-weight), `.editable-name` (accent color, bold)
    - Style `.topbar-center` (text-align center, flex: 1)
    - Style `.clock` (1.6rem, font-weight 700, tabular-nums), `.date-display` (0.75rem, muted color)
    - _Requirements: 7.2_

- [x] 4. Name modal
  - [x] 4.1 Add `#name-modal` to `index.html` with `class="modal hidden"`, `role="dialog"`, `aria-modal="true"`, `aria-labelledby="name-modal-title"`
    - Inner `.modal-box`: `<h2 id="name-modal-title">`, `#name-input` (type=text, maxlength=30, placeholder), Save and Cancel buttons
    - _Requirements: 2.3, 2.12, 8.2_
  - [x] 4.2 Style `.modal` (fixed overlay, semi-transparent backdrop, flex centering, `fade-in` keyframe animation)
    - Style `.modal-box` (surface background, border, radius, shadow, max-width 380px)
    - Style `.modal-actions` (flex, end-justified)
    - Define `.hidden { display: none !important }`
    - _Requirements: 2.3, 8.3_

- [x] 5. Dashboard grid and card component
  - [x] 5.1 Add `<main class="dashboard">` to `index.html` with CSS grid (`grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`), gap, max-width, and auto margins
    - _Requirements: 7.1_
  - [x] 5.2 Define `.card` base styles (surface background, border, `var(--radius)`, shadow, flex column, gap, background/border-color transitions)
    - Define `.card-header` (flex, align-items center, space-between)
    - Define `.badge` (accent-light background, accent text, pill border-radius, font-weight 700)
    - _Requirements: 7.1_

- [x] 6. Focus timer widget
  - [x] 6.1 Add timer card HTML inside `<main>`: `<section class="card timer-card" aria-labelledby="timer-heading">`
    - `.card-header`: `<h2 id="timer-heading">Focus Timer</h2>`, settings button `#timer-settings-btn` (⚙️)
    - Timer display `div.timer-display` with `aria-live="polite"` `aria-atomic="true"`: `#timer-minutes`, `.timer-sep`, `#timer-seconds`
    - `.timer-controls`: `#timer-start`, `#timer-stop` (disabled), `#timer-reset`
    - Settings panel `#timer-settings-panel.settings-panel.hidden`: label, `#timer-duration-input` (number, min=1, max=120), `#timer-duration-save` button
    - _Requirements: 4.1, 4.3, 4.5, 4.6, 4.15, 8.1_
  - [x] 6.2 Style `.timer-card` (align-items center), `.timer-display` (4rem, font-weight 800, accent color, tabular-nums, padding)
    - Style `.timer-sep` with `blink` keyframe animation (opacity alternates at 50% on 1s step)
    - Style `.timer-controls` (flex, gap, flex-wrap, center), `.settings-panel` (surface-2 bg, border, padding, flex)
    - _Requirements: 4.3_
  - [x] 6.3 Implement JS timer state variables: `timerDuration` (load from `timer_duration`, default 25), `timerRemaining`, `timerInterval`, `timerRunning`
    - Implement `renderTimer()`: compute MM/SS, write `#timer-minutes` / `#timer-seconds`, update `document.title` when running
    - Implement `setTimerButtons(running)`: toggle `disabled` on Start/Stop
    - Call `renderTimer()` on page load; set `#timer-duration-input` value from loaded duration
    - _Requirements: 4.1, 4.2, 4.5, 4.6_
  - [x] 6.4 Implement Start button event: set `timerRunning = true`, call `setTimerButtons(true)`, start `setInterval` decrementing `timerRemaining` each second, call `renderTimer()` on each tick
    - _Requirements: 4.4, 4.5, 4.9_
  - [x] 6.5 Implement Stop button event: `clearInterval`, set `timerRunning = false`, call `setTimerButtons(false)`, restore `document.title`
    - _Requirements: 4.7, 4.10_
  - [x] 6.6 Implement Reset button event: `clearInterval`, restore `timerRemaining = timerDuration * 60`, call `setTimerButtons(false)`, call `renderTimer()`
    - _Requirements: 4.8, 4.10_
  - [x] 6.7 Implement timer completion logic inside the interval callback: when `timerRemaining <= 0`, clear interval, set `timerRunning = false`, render 00:00, restore `document.title`, fire `Notification` if permission granted else `alert()`
    - _Requirements: 4.11, 4.12, 4.13_
  - [x] 6.8 Implement settings panel toggle on ⚙️ button click (`.classList.toggle('hidden')`)
    - Implement Apply button: validate `val` ∈ [1, 120] and is integer; on valid: update `timerDuration`, `save('timer_duration', …)`, reset timer state, close panel; on invalid: return early
    - _Requirements: 4.15, 4.16, 4.17, 4.18_
  - [x] 6.9 Request Notification permission on page load (`Notification.requestPermission()` when `Notification.permission === 'default'`)
    - _Requirements: 4.14_

- [x] 7. To-do list widget
  - [x] 7.1 Add todo card HTML inside `<main>`: `<section class="card todo-card" aria-labelledby="todo-heading">`
    - `.card-header`: `<h2 id="todo-heading">To-Do List</h2>`, `<span id="todo-count" class="badge">`
    - `<form id="todo-form">`: `#todo-input` (type=text, maxlength=120, placeholder, aria-label), Add button
    - `<ul id="todo-list" class="todo-list" aria-label="Tasks">`
    - `.todo-footer`: `#clear-done-btn`
    - _Requirements: 5.1, 5.3, 5.17, 5.18_
  - [x] 7.2 Style `.todo-form` (flex, gap), `.todo-list` (flex column, max-height 340px, overflow-y auto, custom `::-webkit-scrollbar`)
    - Style `.todo-list:empty::after` placeholder text
    - Style `.todo-item` (flex, gap, border, surface-2 bg, `slide-in` animation), `.todo-item.done` (strikethrough, 0.6 opacity, transparent border)
    - Style `.todo-text` (flex 1, word-break, contenteditable dashed border state), `.todo-actions` (opacity 0, reveal on hover/focus-within), `.todo-footer`
    - _Requirements: 5.6, 5.7, 5.17, 5.18_
  - [x] 7.3 Implement JS task state: `tasks = load('tasks', [])`, `saveTasks()`, `renderBadge()`, `renderTasks()`, `createTaskEl(task)`
    - `renderBadge()`: count `tasks.filter(t => !t.done).length`; hide badge when `tasks.length === 0`
    - `renderTasks()`: clear `#todo-list`, call `createTaskEl` for each task, call `renderBadge()`
    - Call `renderTasks()` on page load
    - _Requirements: 5.1, 5.2, 5.14, 5.15_
  - [x] 7.4 Implement `createTaskEl(task)`: build `<li>` with checkbox, text span, actions div (edit + delete buttons); attach all event listeners inline
    - Checkbox: `aria-label="Mark task as done"`, toggle `task.done`, save, `renderBadge()`
    - Text span: `role="textbox"`, `aria-label="Task text"`
    - Edit button: `aria-label="Edit task"` (✏️ / ✔️ toggle), `contenteditable` toggle, Enter = save, Escape = revert
    - Delete button: `class="icon-btn btn-danger"`, `aria-label="Delete task"`, slide-right then remove animation, filter array, save, `renderBadge()`
    - _Requirements: 5.6, 5.7, 5.8, 5.9, 5.10, 5.11, 5.12, 5.13, 8.4, 8.5, 8.6, 8.7_
  - [x] 7.5 Implement form submit handler: guard empty/whitespace input; create task `{ id: Date.now().toString(), text, done: false }`; `tasks.unshift(task)`; `saveTasks()`; prepend `createTaskEl` to `#todo-list`; `renderBadge()`; clear and refocus input
    - _Requirements: 5.3, 5.4, 5.5_
  - [x] 7.6 Implement "Clear completed" button: `tasks = tasks.filter(t => !t.done)`, `saveTasks()`, `renderTasks()`
    - _Requirements: 5.16_

- [x] 8. Quick links widget
  - [x] 8.1 Add links card HTML inside `<main>`: `<section class="card links-card" aria-labelledby="links-heading">`
    - `.card-header`: `<h2 id="links-heading">Quick Links</h2>`
    - `<form id="link-form">`: `#link-name-input` (type=text, maxlength=30, aria-label), `#link-url-input` (type=url, aria-label), Add button
    - `<div id="links-grid" class="links-grid" role="list" aria-label="Quick links">`
    - _Requirements: 6.1, 6.8, 8.8_
  - [x] 8.2 Style `.link-form` (3-column grid: `1fr 2fr auto`, gap), `@media (max-width: 420px)` override to single column
    - Style `.links-grid` (flex, flex-wrap, gap), `.links-grid:empty::after` placeholder
    - Style `.link-chip` (inline-flex, pill border-radius, accent-light bg, `slide-in` animation; hover: fill accent, scale 1.04)
    - Style `.link-chip-delete` (no border/bg, inherits color, opacity 0.6, hover opacity 1)
    - _Requirements: 6.9, 7.3_
  - [x] 8.3 Implement JS links state: `links = load('quick_links', [])`, `saveLinks()`, `normaliseUrl(url)` (prepend `https://` when no protocol), `renderLinks()`, `createLinkEl(link)`
    - `renderLinks()`: clear `#links-grid`, call `createLinkEl` for each link
    - `createLinkEl(link)`: build `.link-chip` div with `role="listitem"`, `<a>` (`target="_blank"`, `rel="noopener noreferrer"`), delete button with `aria-label="Remove {name}"`
    - Delete button: fade+scale transition then remove, filter array, `saveLinks()`
    - Call `renderLinks()` on page load
    - _Requirements: 6.1, 6.2, 6.6, 6.7, 8.8, 8.9_
  - [x] 8.4 Implement form submit handler: guard empty label/url; call `normaliseUrl`; validate with `new URL()`; on invalid show `alert('Please enter a valid URL.')`; on valid create `{ id: Date.now().toString(), name, url }`, push, `saveLinks()`, append chip, clear inputs, refocus label input
    - _Requirements: 6.3, 6.4, 6.5_

- [x] 9. Clock and greeting
  - [x] 9.1 Implement `updateClock()` in JS:
    - 12-hour format: `h12 = h % 12 || 12`; `ampm = h >= 12 ? 'PM' : 'AM'`
    - Zero-pad hours, minutes, seconds with `pad()`
    - Write `#clock`: `` `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}` ``
    - Write `#date`: `` `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}` ``
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 9.2 Implement greeting logic inside `updateClock()`: `h < 12 → "Good morning"`, `h < 17 → "Good afternoon"`, `h < 21 → "Good evening"`, else `"Good night"`
    - Write result to `#greeting-text`
    - _Requirements: 1.4, 1.5, 1.6, 1.7, 1.8_
  - [x] 9.3 Call `updateClock()` immediately on page load, then `setInterval(updateClock, 1000)`
    - _Requirements: 1.2_

- [x] 10. Theme toggle
  - [x] 10.1 Implement `applyTheme(dark)`: set `document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')`; set `themeToggleBtn.textContent` to `'☀️'` or `'🌙'`; update `title` and `aria-label`
    - _Requirements: 3.3, 3.4, 3.5, 3.7, 8.10_
  - [x] 10.2 Load saved preference: `isDark = load('theme_dark', false)`; call `applyTheme(isDark)` before first paint
    - _Requirements: 3.1, 3.2, 3.8_
  - [x] 10.3 Attach click listener to `#theme-toggle`: toggle `isDark`, `save('theme_dark', isDark)`, call `applyTheme(isDark)`
    - _Requirements: 3.5, 3.6_

- [x] 11. User name
  - [x] 11.1 Implement `renderName()`: read `load('user_name', 'Friend')`, set `userNameEl.textContent`
    - Call `renderName()` on page load
    - _Requirements: 2.1, 2.2_
  - [x] 11.2 Implement `openNameModal()`: pre-populate `nameInput.value` with `load('user_name', '')`; remove `.hidden` from `#name-modal`; call `nameInput.focus()`
    - Implement `closeNameModal()`: add `.hidden` to `#name-modal`
    - _Requirements: 2.3, 2.4, 2.5, 8.3_
  - [x] 11.3 Attach click listeners: `#user-name` and `#edit-name-btn` → `openNameModal()`
    - _Requirements: 2.3_
  - [x] 11.4 Implement save path: Save button click and `nameInput` Enter keydown → trim value; if non-empty: `save('user_name', name)`, `renderName()`, `closeNameModal()`; if empty: `closeNameModal()` without saving
    - _Requirements: 2.6, 2.7, 2.8_
  - [x] 11.5 Implement cancel/dismiss path: Cancel button click, Escape keydown, backdrop click (target === modal) → `closeNameModal()`
    - _Requirements: 2.9, 2.10, 2.11_

- [x] 12. Responsive CSS
  - [x] 12.1 Add `@media (max-width: 600px)` block: `.topbar { flex-wrap: wrap; gap: .5rem; padding: .75rem 1rem }`, `.topbar-left, .topbar-right { font-size: .875rem }`, `.clock { font-size: 1.3rem }`, `.timer-display { font-size: 3rem }`, `.dashboard { padding: 1rem; gap: 1rem }`
    - _Requirements: 7.2_
  - [x] 12.2 Add `@media (max-width: 420px)` block: `.link-form { grid-template-columns: 1fr }`
    - _Requirements: 7.3_

- [x] 13. Accessibility attributes
  - [x] 13.1 Confirm `aria-live="polite"` and `aria-atomic="true"` on `.timer-display` in HTML
    - _Requirements: 8.1_
  - [x] 13.2 Confirm `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="name-modal-title"` on `#name-modal`
    - _Requirements: 8.2_
  - [x] 13.3 Confirm `aria-label="Mark task as done"` on task checkbox, `aria-label="Edit task"` on edit button, `aria-label="Delete task"` on delete button in `createTaskEl`
    - _Requirements: 8.4, 8.5, 8.6_
  - [x] 13.4 Confirm `role="textbox"` and `aria-label="Task text"` on task text span in `createTaskEl`
    - _Requirements: 8.7_
  - [x] 13.5 Confirm `role="list"` on `#links-grid` and `role="listitem"` on each `.link-chip` in `createLinkEl`
    - _Requirements: 8.8_
  - [x] 13.6 Confirm `aria-label="Remove {name}"` on each Link_Chip delete button in `createLinkEl`
    - _Requirements: 8.9_
  - [x] 13.7 Confirm `applyTheme(dark)` updates both `.title` and `aria-label` on `#theme-toggle` to reflect the mode it switches to
    - _Requirements: 8.10_

- [x] 14. Final checkpoint — verify complete implementation
  - Confirm `index.html`, `css/style.css`, and `js/app.js` are all present and consistent
  - Confirm all `localStorage` keys (`theme_dark`, `user_name`, `timer_duration`, `tasks`, `quick_links`) persist and restore correctly on page reload
  - Confirm all accessibility attributes match requirements
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are marked complete — this document records the implementation that already exists in `index.html`, `css/style.css`, and `js/app.js`.
- Tasks marked with `*` are optional and can be skipped for faster MVP; none are marked optional here because the full feature set is already implemented.
- Each task references specific requirements from `requirements.md` for traceability.
- The design document (`design.md`) contains 13 correctness properties; property-based tests are the natural next step if a test suite is added in future.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5"] },
    { "id": 2, "tasks": ["3.1", "5.1"] },
    { "id": 3, "tasks": ["3.2", "4.1", "5.2"] },
    { "id": 4, "tasks": ["4.2", "6.1", "7.1", "8.1"] },
    { "id": 5, "tasks": ["6.2", "7.2", "8.2", "9.1", "10.1", "11.1"] },
    { "id": 6, "tasks": ["6.3", "7.3", "8.3", "9.2", "10.2", "11.2"] },
    { "id": 7, "tasks": ["6.4", "6.5", "6.6", "7.4", "7.5", "8.4", "9.3", "10.3", "11.3"] },
    { "id": 8, "tasks": ["6.7", "6.8", "6.9", "7.6", "11.4", "11.5"] },
    { "id": 9, "tasks": ["12.1", "12.2"] },
    { "id": 10, "tasks": ["13.1", "13.2", "13.3", "13.4", "13.5", "13.6", "13.7"] }
  ]
}
```
