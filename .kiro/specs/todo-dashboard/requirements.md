# Requirements Document

## Introduction

The Todo Dashboard is a self-contained, client-side productivity page that runs entirely in the browser with no build step, no server, and no external dependencies. It provides four interactive widgets: a live clock with a contextual greeting, a Pomodoro-style focus timer, a persistent to-do list, and a quick-links launcher. All user data is stored in `localStorage` so it survives page reloads. The UI supports light and dark themes, is keyboard-accessible, and adapts to small screens through CSS media queries.

## Glossary

- **Dashboard**: The single-page application described in this document.
- **Clock**: The live time display in the top bar showing the current hour, minute, second, and AM/PM indicator.
- **Greeting**: The time-of-day salutation shown to the left of the name in the top bar.
- **Name_Modal**: The dialog used to enter or change the user's display name.
- **Theme_Toggle**: The button in the top-right corner that switches between light and dark palettes.
- **Timer**: The countdown widget with Start, Stop, and Reset controls.
- **Task**: A to-do item represented as `{ id, text, done }` and stored in `localStorage`.
- **Task_List**: The ordered collection of Task items displayed in the to-do card.
- **Badge**: The small pill in the to-do card header that shows the count of incomplete tasks.
- **Link**: A quick-access shortcut represented as `{ id, name, url }` and stored in `localStorage`.
- **Link_Chip**: The pill-shaped element that renders a single Link in the quick-links grid.
- **Storage**: The browser's `localStorage` API used for all persistent state.

---

## Requirements

### Requirement 1: Live Clock and Contextual Greeting

**User Story:** As a user, I want to see the current time and a time-appropriate greeting at all times, so that I always have a quick reference to the time and feel welcomed by the dashboard.

#### Acceptance Criteria

1. WHEN the page loads, THE Clock SHALL display the current time in 12-hour `HH:MM:SS AM/PM` format with zero-padded hours, minutes, and seconds.
2. WHILE the page is open, THE Clock SHALL update its displayed time every 1 000 milliseconds.
3. WHEN the page loads, THE Dashboard SHALL display the full date below the clock in `Day, Month D, YYYY` format (e.g., "Monday, January 6, 2025").
4. WHILE the current hour is in the range [0, 11], THE Greeting SHALL display the text "Good morning".
5. WHILE the current hour is in the range [12, 16], THE Greeting SHALL display the text "Good afternoon".
6. WHILE the current hour is in the range [17, 20], THE Greeting SHALL display the text "Good evening".
7. WHILE the current hour is in the range [21, 23], THE Greeting SHALL display the text "Good night".
8. WHEN the clock tick causes the hour value to change, THE Dashboard SHALL update the Greeting text to match the greeting defined for the new current hour.
9. IF the Clock fails to obtain the current time from the browser environment, THEN THE Clock SHALL display "--:--:-- --" in place of the time and display "---" in place of the date.

---

### Requirement 2: Custom User Name

**User Story:** As a user, I want to set a personal display name in the greeting, so that the dashboard feels personalised to me.

#### Acceptance Criteria

1. WHEN the page loads and no name has been saved, THE Dashboard SHALL display "Friend" as the default name in the greeting.
2. WHEN the page loads and a name has been previously saved, THE Dashboard SHALL display the saved name from Storage key `user_name`.
3. WHEN a user clicks the displayed name or the pencil button, THE Name_Modal SHALL open and focus the text input within 100ms.
4. WHEN the Name_Modal opens and a name is currently saved, THE Name_Modal SHALL pre-populate the text input with that saved name.
5. WHEN the Name_Modal opens and no name is currently saved, THE Name_Modal SHALL pre-populate the text input with an empty string.
6. WHEN a user clicks the Save button with a non-empty trimmed name in the Name_Modal, THE Dashboard SHALL save the trimmed name to Storage key `user_name` and update the displayed greeting name.
7. WHEN a user presses the Enter key while the Name_Modal text input is focused, THE Name_Modal SHALL behave as if the Save button was clicked.
8. IF the trimmed value of the Name_Modal text input is empty when the user attempts to save, THEN THE Dashboard SHALL retain the previously saved name without overwriting it and close the Name_Modal.
9. WHEN a user clicks the Cancel button in the Name_Modal, THE Name_Modal SHALL close without modifying the value at Storage key `user_name`.
10. WHEN a user presses the Escape key while the Name_Modal is open, THE Name_Modal SHALL close without modifying the value at Storage key `user_name`.
11. WHEN a user clicks the semi-transparent backdrop outside the Name_Modal dialog box, THE Name_Modal SHALL close without modifying the value at Storage key `user_name`.
12. THE Name_Modal text input SHALL reject any input beyond 30 characters, keeping the value at exactly 30 characters maximum.

---

### Requirement 3: Light and Dark Theme Toggle

**User Story:** As a user, I want to switch between a light and a dark colour palette, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. WHEN the page loads for the first time with no saved preference, THE Dashboard SHALL apply the light theme by default.
2. WHEN the page loads and a theme preference has been saved, THE Dashboard SHALL restore the saved theme from Storage key `theme_dark` before the first paint, such that no light theme flash is visible before the dark theme is applied.
3. WHEN the light theme is active, THE Theme_Toggle SHALL display the 🌙 emoji.
4. WHEN the dark theme is active, THE Theme_Toggle SHALL display the ☀️ emoji.
5. WHEN a user clicks the Theme_Toggle, THE Dashboard SHALL switch to the opposite theme within 50 milliseconds without a page reload.
6. WHEN a user clicks the Theme_Toggle, THE Dashboard SHALL save the new theme preference as a boolean to Storage key `theme_dark`.
7. WHEN the theme changes, THE Dashboard SHALL apply the new palette via a CSS transition with a duration between 150 milliseconds and 400 milliseconds.
8. IF the Storage key `theme_dark` contains a value that is neither `true` nor `false`, THEN THE Dashboard SHALL discard the stored value and apply the light theme as the default.

---

### Requirement 4: Focus Timer

**User Story:** As a user, I want a countdown timer to help me work in focused intervals, so that I can manage my time and concentration.

#### Acceptance Criteria

1. WHEN the page loads, THE Timer SHALL display 25 minutes as the default duration in `MM:SS` format with zero-padding.
2. WHEN the page loads and a custom duration has been saved, THE Timer SHALL restore the saved duration from Storage key `timer_duration`.
3. WHILE the Timer is idle, THE Timer SHALL display the full remaining time and the colon separator SHALL blink at a rate of once per second (500 ms visible, 500 ms hidden).
4. WHEN a user clicks the Start button, THE Timer SHALL begin decrementing the remaining time by one second per second.
5. WHEN the Timer is running, THE Start button SHALL be disabled and the Stop button SHALL be enabled.
6. WHEN the Timer is idle, THE Stop button SHALL be disabled and the Start button SHALL be enabled.
7. WHEN a user clicks the Stop button, THE Timer SHALL pause the countdown without resetting the remaining time.
8. WHEN a user clicks the Reset button, THE Timer SHALL stop the countdown and restore the remaining time to the full configured duration.
9. WHILE the Timer is running, THE Dashboard SHALL update the browser tab title to `MM:SS – Dashboard` reflecting the current remaining time.
10. WHEN the user stops or resets the Timer, THE Dashboard SHALL restore the browser tab title to "My Dashboard".
11. WHEN the Timer countdown reaches 00:00, THE Timer SHALL stop decrementing and remain displayed at 00:00 until the user clicks Reset.
12. WHEN the Timer countdown reaches 00:00 and the browser Notification permission is granted, THE Timer SHALL fire a browser Notification with the message "Focus session complete! 🎉" and THE Dashboard SHALL restore the browser tab title to "My Dashboard".
13. IF the Timer countdown reaches 00:00 and the browser Notification permission is not granted, THEN THE Timer SHALL display a fallback `alert()` message.
14. WHEN the page loads, THE Dashboard SHALL request browser Notification permission if the current permission state is "default".
15. WHEN a user clicks the settings (⚙️) button, THE Timer SHALL toggle the visibility of the duration settings panel.
16. WHEN a user enters a duration in the settings panel and clicks Apply, THE Timer SHALL accept only integer values in the range [1, 120] minutes.
17. IF the user enters a value outside [1, 120] or a non-integer in the settings panel and clicks Apply, THEN THE Timer SHALL make no changes to the current duration or timer state.
18. WHEN a valid duration is applied, THE Timer SHALL save the new duration to Storage key `timer_duration`, reset the remaining time to the new duration, and close the settings panel.

---

### Requirement 5: To-Do List

**User Story:** As a user, I want to maintain a persistent list of tasks, so that I can track what I need to accomplish and mark items as complete.

#### Acceptance Criteria

1. WHEN the page loads, THE Task_List SHALL restore all saved tasks from Storage key `tasks`, rendering each task with its saved `done` state, text, and `id`.
2. IF Storage key `tasks` contains invalid or unparseable data, THEN THE Task_List SHALL initialize with an empty array and not throw an error.
3. WHEN a user submits the add-task form with a non-empty input, THE Task_List SHALL create a new Task with a unique `id` (timestamp), the trimmed text, and `done: false`, and prepend it to the top of the list.
4. WHEN a new task is added, THE Dashboard SHALL persist the updated tasks array to Storage key `tasks` and clear the text input.
5. IF the user submits the add-task form with an empty or whitespace-only input, THEN THE Task_List SHALL not add any task and the list SHALL remain unchanged.
6. WHEN a user checks the checkbox on a task, THE Task_List SHALL mark that task's `done` property as `true`, apply a strikethrough style and reduced opacity to the item, and persist the change to Storage.
7. WHEN a user unchecks the checkbox on a task, THE Task_List SHALL mark that task's `done` property as `false`, remove the strikethrough style and restore full opacity, and persist the change to Storage.
8. WHEN a user clicks the edit (✏️) button on a task, THE Task_List SHALL make the task text contenteditable and change the button to a save (✔️) button.
9. WHEN a task is in edit mode and the user clicks the save (✔️) button with non-empty text, THE Task_List SHALL update the task text, exit edit mode, persist the change to Storage, and restore the edit button icon.
10. WHEN a task is in edit mode and the user presses the Enter key, THE Task_List SHALL behave as if the save button was clicked.
11. IF a task is in edit mode and the user clicks save or presses Enter with empty text, THEN THE Task_List SHALL revert the displayed text to the previously saved value without writing to Storage.
12. WHEN a task is in edit mode and the user presses the Escape key, THE Task_List SHALL exit edit mode and revert the displayed text to the previously saved value without writing to Storage.
13. WHEN a user clicks the delete (🗑️) button on a task, THE Task_List SHALL animate the item sliding right then remove it from the DOM, remove it from the tasks array, and persist the change to Storage.
14. THE Badge SHALL display the count of tasks where `done === false` after every task mutation.
15. WHEN the tasks array is empty, THE Badge SHALL be hidden.
16. WHEN a user clicks the "Clear completed" button, THE Task_List SHALL remove all tasks where `done === true` from the array, persist the updated array to Storage, and re-render the list.
17. WHEN the task list is empty, THE Task_List SHALL display the placeholder text "No tasks yet — add one above." via a CSS pseudo-element.
18. THE Task_List SHALL constrain its visible height to 340 pixels and scroll internally when the list exceeds that height.

---

### Requirement 6: Quick Links

**User Story:** As a user, I want to save and launch labelled shortcut links from the dashboard, so that I can quickly navigate to frequently used websites.

#### Acceptance Criteria

1. WHEN the page loads, THE Dashboard SHALL restore all saved links from Storage key `quick_links` and render a Link_Chip for each saved link.
2. IF Storage key `quick_links` contains data that cannot be parsed into a valid array, THEN THE Dashboard SHALL treat the links array as empty and not throw an error.
3. WHEN a user submits the add-link form with a non-empty label and URL, THE Dashboard SHALL normalise the URL by prepending `https://` if no scheme (e.g. `http://` or `https://`) is present.
4. WHEN the normalised URL is valid according to the `URL` constructor, THE Dashboard SHALL create a new Link with a unique `id`, the trimmed label, and the normalised URL, append it to the links array, persist to Storage, and render a new Link_Chip.
5. IF the normalised URL is invalid according to the `URL` constructor, THEN THE Dashboard SHALL show an `alert()` with the message "Please enter a valid URL." and not add the link.
6. WHEN a user clicks a Link_Chip, THE Dashboard SHALL open the link URL in a new browser tab with `rel="noopener noreferrer"`.
7. WHEN a user clicks the ✕ delete button on a Link_Chip, THE Dashboard SHALL animate the chip fading out and scaling down, then remove it from the DOM, remove it from the links array, and persist the change to Storage.
8. THE Link_Chip label input SHALL enforce a maximum length of 30 characters.
9. WHEN the links array is empty, THE Dashboard SHALL display the placeholder text "No links saved yet." via a CSS pseudo-element.

---

### Requirement 7: Responsive Layout

**User Story:** As a user, I want the dashboard to adapt to different screen sizes, so that I can use it comfortably on both desktop and mobile devices.

#### Acceptance Criteria

1. THE Dashboard SHALL arrange widget cards in a grid that reflows from multiple columns to a single column as the viewport narrows, with each card having a minimum width of 300 pixels, and with no JavaScript involved.
2. WHEN the viewport width is 600 pixels or less, THE Dashboard SHALL collapse the top bar so that its title and controls wrap onto separate lines, reduce the clock font size to 1.3rem, reduce the timer display font size to 3rem, and reduce dashboard padding.
3. WHEN the viewport width is 420 pixels or less, THE quick-links add form SHALL stack its label, text input, and URL input vertically in a single column with no horizontal overflow.

---

### Requirement 8: Accessibility

**User Story:** As a user relying on assistive technology, I want all interactive controls to be labelled and keyboard-navigable, so that I can use the dashboard without a mouse.

#### Acceptance Criteria

1. THE Timer display SHALL carry `aria-live="polite"` and `aria-atomic="true"` so that screen readers announce countdown changes.
2. THE Name_Modal SHALL carry `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` referencing the modal title element.
3. WHEN the Name_Modal opens, THE Dashboard SHALL move keyboard focus to the name text input within 100 milliseconds.
4. THE task checkbox SHALL carry an `aria-label` of "Mark task as done".
5. THE task edit button SHALL carry an `aria-label` of "Edit task".
6. THE task delete button SHALL carry an `aria-label` of "Delete task".
7. THE task text span SHALL carry `role="textbox"` and an `aria-label` of "Task text".
8. THE links grid container SHALL carry `role="list"` and each Link_Chip SHALL carry `role="listitem"`.
9. THE Link_Chip delete button SHALL carry an `aria-label` of "Remove {name}" where `{name}` is the link's display label.
10. THE Theme_Toggle button SHALL have its `aria-label` and `title` updated to reflect the mode it will switch to on each click.
