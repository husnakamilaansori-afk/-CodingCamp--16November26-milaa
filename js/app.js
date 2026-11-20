/* ═══════════════════════════════════════════════════════════════
   app.js  –  To-Do Dashboard
   Sections:
     1. Helpers
     2. Clock & Greeting
     3. Theme
     4. Name
     5. Timer
     6. To-Do List
     7. Quick Links
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. HELPERS
───────────────────────────────────────────── */

/** Read a value from localStorage, returning `fallback` if absent or unparseable. */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Write a JSON-serialisable value to localStorage. */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Pad a number to 2 digits. */
const pad = (n) => String(n).padStart(2, '0');

/* ─────────────────────────────────────────────
   2. CLOCK & GREETING
───────────────────────────────────────────── */

const clockEl    = document.getElementById('clock');
const dateEl     = document.getElementById('date');
const greetingEl = document.getElementById('greeting-text');

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

function updateClock() {
  const now  = new Date();
  const h    = now.getHours();
  const m    = now.getMinutes();
  const s    = now.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12  = h % 12 || 12;

  clockEl.textContent = `${pad(h12)}:${pad(m)}:${pad(s)} ${ampm}`;
  dateEl.textContent  = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  const greeting =
    h < 12 ? 'Good morning' :
    h < 17 ? 'Good afternoon' :
    h < 21 ? 'Good evening' : 'Good night';
  greetingEl.textContent = greeting;
}

updateClock();
setInterval(updateClock, 1000);

/* ─────────────────────────────────────────────
   3. THEME  (light / dark)
───────────────────────────────────────────── */

const themeToggleBtn = document.getElementById('theme-toggle');

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeToggleBtn.textContent = dark ? '☀️' : '🌙';
  themeToggleBtn.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
}

let isDark = load('theme_dark', false);
applyTheme(isDark);

themeToggleBtn.addEventListener('click', () => {
  isDark = !isDark;
  save('theme_dark', isDark);
  applyTheme(isDark);
});

/* ─────────────────────────────────────────────
   4. NAME
───────────────────────────────────────────── */

const userNameEl    = document.getElementById('user-name');
const editNameBtn   = document.getElementById('edit-name-btn');
const nameModal     = document.getElementById('name-modal');
const nameInput     = document.getElementById('name-input');
const nameSaveBtn   = document.getElementById('name-save-btn');
const nameCancelBtn = document.getElementById('name-cancel-btn');

function renderName() {
  userNameEl.textContent = load('user_name', 'Friend');
}
renderName();

function openNameModal() {
  nameInput.value = load('user_name', '');
  nameModal.classList.remove('hidden');
  nameInput.focus();
}

function closeNameModal() {
  nameModal.classList.add('hidden');
}

editNameBtn.addEventListener('click', openNameModal);
userNameEl.addEventListener('click', openNameModal);

nameSaveBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (name) save('user_name', name);
  renderName();
  closeNameModal();
});

nameCancelBtn.addEventListener('click', closeNameModal);

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  nameSaveBtn.click();
  if (e.key === 'Escape') closeNameModal();
});

nameModal.addEventListener('click', (e) => {
  if (e.target === nameModal) closeNameModal();
});

/* ─────────────────────────────────────────────
   5. FOCUS TIMER
───────────────────────────────────────────── */

const timerMinEl    = document.getElementById('timer-minutes');
const timerSecEl    = document.getElementById('timer-seconds');
const timerStartBtn = document.getElementById('timer-start');
const timerStopBtn  = document.getElementById('timer-stop');
const timerResetBtn = document.getElementById('timer-reset');
const timerSetBtn   = document.getElementById('timer-settings-btn');
const timerPanel    = document.getElementById('timer-settings-panel');
const timerDurInput = document.getElementById('timer-duration-input');
const timerDurSave  = document.getElementById('timer-duration-save');

let timerDuration  = load('timer_duration', 25);  // minutes
let timerRemaining = timerDuration * 60;           // seconds
let timerInterval  = null;
let timerRunning   = false;

function renderTimer() {
  const m = Math.floor(timerRemaining / 60);
  const s = timerRemaining % 60;
  timerMinEl.textContent = pad(m);
  timerSecEl.textContent = pad(s);
  document.title = timerRunning ? `${pad(m)}:${pad(s)} – Dashboard` : 'My Dashboard';
}

function setTimerButtons(running) {
  timerStartBtn.disabled = running;
  timerStopBtn.disabled  = !running;
}

renderTimer();
timerDurInput.value = timerDuration;

timerStartBtn.addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  setTimerButtons(true);
  timerInterval = setInterval(() => {
    timerRemaining--;
    renderTimer();
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      setTimerButtons(false);
      timerRemaining = 0;
      renderTimer();
      // Simple browser notification fallback
      if (Notification && Notification.permission === 'granted') {
        new Notification('Focus session complete! 🎉', { body: 'Time for a break.' });
      } else {
        alert('⏰ Focus session complete! Time for a break.');
      }
    }
  }, 1000);
});

timerStopBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning = false;
  setTimerButtons(false);
  document.title = 'My Dashboard';
});

timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerRunning   = false;
  timerRemaining = timerDuration * 60;
  setTimerButtons(false);
  renderTimer();
});

timerSetBtn.addEventListener('click', () => {
  timerPanel.classList.toggle('hidden');
});

timerDurSave.addEventListener('click', () => {
  const val = parseInt(timerDurInput.value, 10);
  if (!val || val < 1 || val > 120) return;
  timerDuration = val;
  save('timer_duration', timerDuration);
  clearInterval(timerInterval);
  timerRunning   = false;
  timerRemaining = timerDuration * 60;
  setTimerButtons(false);
  renderTimer();
  timerPanel.classList.add('hidden');
});

// Request notification permission early (best-effort)
if (Notification && Notification.permission === 'default') {
  Notification.requestPermission();
}

/* ─────────────────────────────────────────────
   6. TO-DO LIST
───────────────────────────────────────────── */

const todoForm     = document.getElementById('todo-form');
const todoInput    = document.getElementById('todo-input');
const todoListEl   = document.getElementById('todo-list');
const todoBadge    = document.getElementById('todo-count');
const clearDoneBtn = document.getElementById('clear-done-btn');

/** @type {{ id: string, text: string, done: boolean }[]} */
let tasks = load('tasks', []);

function saveTasks() {
  save('tasks', tasks);
}

function renderBadge() {
  const remaining = tasks.filter(t => !t.done).length;
  todoBadge.textContent = remaining;
  todoBadge.style.display = tasks.length ? '' : 'none';
}

function createTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'todo-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', 'Mark task as done');
  checkbox.addEventListener('change', () => {
    task.done = checkbox.checked;
    li.classList.toggle('done', task.done);
    saveTasks();
    renderBadge();
  });

  // Text (editable)
  const span = document.createElement('span');
  span.className = 'todo-text';
  span.textContent = task.text;
  span.setAttribute('role', 'textbox');
  span.setAttribute('aria-label', 'Task text');

  // Actions
  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.title = 'Edit task';
  editBtn.setAttribute('aria-label', 'Edit task');
  editBtn.textContent = '✏️';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon-btn btn-danger';
  deleteBtn.title = 'Delete task';
  deleteBtn.setAttribute('aria-label', 'Delete task');
  deleteBtn.textContent = '🗑️';

  // Edit behaviour
  editBtn.addEventListener('click', () => {
    if (span.contentEditable === 'true') {
      // Save
      const newText = span.textContent.trim();
      if (newText) {
        task.text = newText;
        saveTasks();
      } else {
        span.textContent = task.text; // revert
      }
      span.contentEditable = 'false';
      editBtn.textContent = '✏️';
      editBtn.title = 'Edit task';
    } else {
      span.contentEditable = 'true';
      span.focus();
      // move caret to end
      const range = document.createRange();
      range.selectNodeContents(span);
      range.collapse(false);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      editBtn.textContent = '✔️';
      editBtn.title = 'Save edit';
    }
  });

  span.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); editBtn.click(); }
    if (e.key === 'Escape') {
      span.contentEditable = 'false';
      span.textContent = task.text;
      editBtn.textContent = '✏️';
    }
  });

  // Delete behaviour
  deleteBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    li.style.animation = 'none';
    li.style.opacity = '0';
    li.style.transform = 'translateX(16px)';
    li.style.transition = 'opacity .18s, transform .18s';
    setTimeout(() => li.remove(), 180);
    renderBadge();
  });

  actions.append(editBtn, deleteBtn);
  li.append(checkbox, span, actions);
  return li;
}

function renderTasks() {
  todoListEl.innerHTML = '';
  tasks.forEach(task => todoListEl.appendChild(createTaskEl(task)));
  renderBadge();
}

todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = todoInput.value.trim();
  if (!text) return;
  const task = { id: Date.now().toString(), text, done: false };
  tasks.unshift(task);
  saveTasks();
  todoListEl.prepend(createTaskEl(task));
  renderBadge();
  todoInput.value = '';
  todoInput.focus();
});

clearDoneBtn.addEventListener('click', () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
});

renderTasks();

/* ─────────────────────────────────────────────
   7. QUICK LINKS
───────────────────────────────────────────── */

const linkForm      = document.getElementById('link-form');
const linkNameInput = document.getElementById('link-name-input');
const linkUrlInput  = document.getElementById('link-url-input');
const linksGrid     = document.getElementById('links-grid');

/** @type {{ id: string, name: string, url: string }[]} */
let links = load('quick_links', []);

function saveLinks() {
  save('quick_links', links);
}

function normaliseUrl(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

function createLinkEl(link) {
  const chip = document.createElement('div');
  chip.className = 'link-chip';
  chip.setAttribute('role', 'listitem');

  const anchor = document.createElement('a');
  anchor.href   = link.url;
  anchor.target = '_blank';
  anchor.rel    = 'noopener noreferrer';
  anchor.textContent = link.name;
  anchor.style.textDecoration = 'none';
  anchor.style.color = 'inherit';

  const delBtn = document.createElement('button');
  delBtn.className = 'link-chip-delete';
  delBtn.title = 'Remove link';
  delBtn.setAttribute('aria-label', `Remove ${link.name}`);
  delBtn.textContent = '✕';

  delBtn.addEventListener('click', (e) => {
    e.preventDefault();
    links = links.filter(l => l.id !== link.id);
    saveLinks();
    chip.style.transition = 'opacity .15s, transform .15s';
    chip.style.opacity = '0';
    chip.style.transform = 'scale(.85)';
    setTimeout(() => chip.remove(), 160);
  });

  chip.append(anchor, delBtn);
  return chip;
}

function renderLinks() {
  linksGrid.innerHTML = '';
  links.forEach(link => linksGrid.appendChild(createLinkEl(link)));
}

linkForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = linkNameInput.value.trim();
  const url  = normaliseUrl(linkUrlInput.value.trim());

  if (!name || !url) return;

  // Basic URL validation
  try { new URL(url); } catch { alert('Please enter a valid URL.'); return; }

  const link = { id: Date.now().toString(), name, url };
  links.push(link);
  saveLinks();
  linksGrid.appendChild(createLinkEl(link));
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
});

renderLinks();
