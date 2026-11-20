/* ═══════════════════════════════════════════════════════════
   DASHBOARD — app.js
   Sections:
     1. Greeting & Clock
     2. Focus Timer
     3. To-Do List
     4. Quick Links
   All data persisted in localStorage.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. GREETING & CLOCK
───────────────────────────────────────── */
const datetimeEl = document.getElementById('datetime');
const greetingEl = document.getElementById('greeting');

function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good morning ☀️';
  if (hour >= 12 && hour < 17) return 'Good afternoon 🌤️';
  if (hour >= 17 && hour < 21) return 'Good evening 🌆';
  return 'Good night 🌙';
}

function updateClock() {
  const now = new Date();
  const hour = now.getHours();

  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  datetimeEl.textContent = `${dateStr}  •  ${timeStr}`;
  greetingEl.textContent = getGreeting(hour);
}

updateClock();
setInterval(updateClock, 1000);


/* ─────────────────────────────────────────
   2. FOCUS TIMER
───────────────────────────────────────── */
const TIMER_DURATION = 25 * 60; // seconds

const timerDisplay = document.getElementById('timer-display');
const timerLabel   = document.getElementById('timer-label');
const startBtn     = document.getElementById('timer-start');
const stopBtn      = document.getElementById('timer-stop');
const resetBtn     = document.getElementById('timer-reset');

let timerSeconds   = TIMER_DURATION;
let timerInterval  = null;
let timerRunning   = false;

function formatTime(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  timerDisplay.textContent = formatTime(timerSeconds);

  timerDisplay.classList.remove('running', 'finished');
  if (timerRunning) {
    timerDisplay.classList.add('running');
    timerLabel.textContent = 'Stay focused!';
  } else if (timerSeconds === 0) {
    timerDisplay.classList.add('finished');
    timerLabel.textContent = '🎉 Session complete! Take a break.';
  } else if (timerSeconds === TIMER_DURATION) {
    timerLabel.textContent = 'Ready to focus?';
  } else {
    timerLabel.textContent = 'Paused';
  }

  startBtn.disabled = timerRunning || timerSeconds === 0;
  stopBtn.disabled  = !timerRunning;
}

function startTimer() {
  if (timerRunning || timerSeconds === 0) return;
  timerRunning = true;
  timerInterval = setInterval(() => {
    timerSeconds--;
    if (timerSeconds <= 0) {
      timerSeconds = 0;
      clearInterval(timerInterval);
      timerRunning = false;
    }
    renderTimer();
  }, 1000);
  renderTimer();
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  renderTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning  = false;
  timerSeconds  = TIMER_DURATION;
  renderTimer();
}

startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

renderTimer(); // initial render


/* ─────────────────────────────────────────
   3. TO-DO LIST
───────────────────────────────────────── */
const TODO_KEY    = 'dashboard_todos';
const todoInput   = document.getElementById('todo-input');
const todoAddBtn  = document.getElementById('todo-add');
const todoListEl  = document.getElementById('todo-list');
const todoEmptyEl = document.getElementById('todo-empty');

// Modal elements
const editModal   = document.getElementById('edit-modal');
const editInput   = document.getElementById('edit-input');
const editSaveBtn = document.getElementById('edit-save');
const editCancelBtn = document.getElementById('edit-cancel');

let todos = [];
let editingId = null;

function loadTodos() {
  try {
    todos = JSON.parse(localStorage.getItem(TODO_KEY)) || [];
  } catch {
    todos = [];
  }
}

function saveTodos() {
  localStorage.setItem(TODO_KEY, JSON.stringify(todos));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function renderTodos() {
  todoListEl.innerHTML = '';
  todoEmptyEl.style.display = todos.length === 0 ? 'block' : 'none';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item${todo.done ? ' done' : ''}`;
    li.dataset.id = todo.id;

    const checkbox = document.createElement('input');
    checkbox.type    = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.setAttribute('aria-label', 'Mark done');

    const span = document.createElement('span');
    span.className   = 'todo-text';
    span.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.setAttribute('aria-label', 'Edit task');
    editBtn.title = 'Edit';
    editBtn.textContent = '✏️';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-icon';
    deleteBtn.setAttribute('aria-label', 'Delete task');
    deleteBtn.title = 'Delete';
    deleteBtn.textContent = '🗑️';

    // Events
    checkbox.addEventListener('change', () => toggleTodo(todo.id));
    editBtn.addEventListener('click', () => openEditModal(todo.id));
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    actions.append(editBtn, deleteBtn);
    li.append(checkbox, span, actions);
    todoListEl.appendChild(li);
  });
}

function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;

  todos.push({ id: generateId(), text, done: false });
  saveTodos();
  renderTodos();
  todoInput.value = '';
  todoInput.focus();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  saveTodos();
  renderTodos();
}

function openEditModal(id) {
  const todo = todos.find(t => t.id === id);
  if (!todo) return;
  editingId = id;
  editInput.value = todo.text;
  editModal.hidden = false;
  editInput.focus();
  editInput.select();
}

function closeEditModal() {
  editModal.hidden = true;
  editingId = null;
}

function saveEdit() {
  const text = editInput.value.trim();
  if (!text || editingId === null) return;
  const todo = todos.find(t => t.id === editingId);
  if (todo) {
    todo.text = text;
    saveTodos();
    renderTodos();
  }
  closeEditModal();
}

todoAddBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => { if (e.key === 'Enter') addTodo(); });
editSaveBtn.addEventListener('click', saveEdit);
editCancelBtn.addEventListener('click', closeEditModal);
editInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') saveEdit();
  if (e.key === 'Escape') closeEditModal();
});
// Close modal on overlay click
editModal.addEventListener('click', e => { if (e.target === editModal) closeEditModal(); });

loadTodos();
renderTodos();


/* ─────────────────────────────────────────
   4. QUICK LINKS
───────────────────────────────────────── */
const LINKS_KEY    = 'dashboard_links';
const linkNameInput = document.getElementById('link-name');
const linkUrlInput  = document.getElementById('link-url');
const linkAddBtn    = document.getElementById('link-add');
const linksGridEl   = document.getElementById('links-grid');
const linksEmptyEl  = document.getElementById('links-empty');

let links = [];

function loadLinks() {
  try {
    links = JSON.parse(localStorage.getItem(LINKS_KEY)) || [];
  } catch {
    links = [];
  }
}

function saveLinks() {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links));
}

function getFaviconUrl(urlString) {
  try {
    const url = new URL(urlString);
    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
  } catch {
    return null;
  }
}

function ensureProtocol(urlString) {
  if (!/^https?:\/\//i.test(urlString)) {
    return 'https://' + urlString;
  }
  return urlString;
}

function renderLinks() {
  linksGridEl.innerHTML = '';
  linksEmptyEl.style.display = links.length === 0 ? 'block' : 'none';

  links.forEach(link => {
    const wrapper = document.createElement('div');
    wrapper.className = 'link-wrapper';

    const a = document.createElement('a');
    a.className = 'link-chip';
    a.href      = link.url;
    a.target    = '_blank';
    a.rel       = 'noopener noreferrer';

    const favicon = getFaviconUrl(link.url);
    if (favicon) {
      const img = document.createElement('img');
      img.src   = favicon;
      img.className = 'link-favicon';
      img.alt   = '';
      img.width = 14;
      img.height = 14;
      img.onerror = () => img.remove();
      a.appendChild(img);
    }

    const label = document.createElement('span');
    label.className   = 'link-label';
    label.textContent = link.name;
    a.appendChild(label);

    const delBtn = document.createElement('button');
    delBtn.className = 'link-delete';
    delBtn.setAttribute('aria-label', `Remove ${link.name}`);
    delBtn.title = 'Remove';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteLink(link.id));

    wrapper.append(a, delBtn);
    linksGridEl.appendChild(wrapper);
  });
}

function addLink() {
  const name = linkNameInput.value.trim();
  let   url  = linkUrlInput.value.trim();

  if (!name || !url) {
    if (!name) linkNameInput.focus();
    else       linkUrlInput.focus();
    return;
  }

  url = ensureProtocol(url);

  // Basic URL validity check
  try { new URL(url); } catch {
    linkUrlInput.style.borderColor = 'var(--danger)';
    setTimeout(() => linkUrlInput.style.borderColor = '', 1500);
    linkUrlInput.focus();
    return;
  }

  links.push({ id: generateId(), name, url });
  saveLinks();
  renderLinks();
  linkNameInput.value = '';
  linkUrlInput.value  = '';
  linkNameInput.focus();
}

function deleteLink(id) {
  links = links.filter(l => l.id !== id);
  saveLinks();
  renderLinks();
}

linkAddBtn.addEventListener('click', addLink);
linkUrlInput.addEventListener('keydown', e => { if (e.key === 'Enter') addLink(); });
linkNameInput.addEventListener('keydown', e => { if (e.key === 'Enter') linkUrlInput.focus(); });

loadLinks();
renderLinks();
