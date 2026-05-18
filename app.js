let todos = [];
let filter = 'all';
let nextId = 1;

// Show current date in header
const dateEl = document.getElementById('header-date');
if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('de-DE', {
        weekday: 'long', day: 'numeric', month: 'long'
    });
}

function escHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function render() {
    const list = document.getElementById('todo-list');
    const footer = document.getElementById('footer');
    const count = document.getElementById('footer-count');

    const visible = todos.filter(t =>
        filter === 'all' ? true : filter === 'done' ? t.done : !t.done
    );

    list.innerHTML = visible.length === 0
        ? `<div class="empty">${filter === 'done' ? 'Keine erledigten Aufgaben.' : 'Noch keine Aufgaben — leg los!'}</div>`
        : visible.map(t => `
      <div class="todo-item${t.done ? ' done' : ''}">
        <div class="todo-check${t.done ? ' checked' : ''}"
          onclick="toggle(${t.id})"
          role="checkbox"
          aria-checked="${t.done}"
          tabindex="0"
          onkeydown="if(event.key==='Enter'||event.key===' ')toggle(${t.id})">
        </div>
        <span class="todo-text">${escHtml(t.text)}</span>
        <button class="todo-delete" onclick="remove(${t.id})" aria-label="Löschen" title="Löschen">&times;</button>
      </div>`).join('');

    const open = todos.filter(t => !t.done).length;
    const done = todos.filter(t => t.done).length;
    footer.style.display = todos.length ? 'flex' : 'none';
    count.textContent = `${open} offen${done ? ' · ' + done + ' erledigt' : ''}`;
}

function addTodo() {
    const inp = document.getElementById('new-todo');
    const text = inp.value.trim();
    if (!text) { inp.focus(); return; }
    todos.unshift({ id: nextId++, text, done: false });
    inp.value = '';
    inp.focus();
    render();
}

function toggle(id) {
    const t = todos.find(t => t.id === id);
    if (t) t.done = !t.done;
    render();
}

function remove(id) {
    todos = todos.filter(t => t.id !== id);
    render();
}

function setFilter(f, btn) {
    filter = f;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
}

function clearDone() {
    todos = todos.filter(t => !t.done);
    render();
}

document.getElementById('new-todo').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
});

render();
