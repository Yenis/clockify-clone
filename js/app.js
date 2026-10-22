// Connects the page to the logic: buttons, clock, list of entries.

const descriptionInput = document.getElementById('description');
const clock = document.getElementById('clock');
const startStopButton = document.getElementById('start-stop');
const timerBar = document.getElementById('timer-bar');
const emptyMessage = document.getElementById('empty-message');
const entriesTable = document.getElementById('entries-table');
const entriesBody = document.getElementById('entries-body');
const todayTotal = document.getElementById('today-total');
const manualForm = document.getElementById('manual-form');
const manualError = document.getElementById('manual-error');

// All finished entries: { id, description, start, end }.
// start and end are stored as ISO text, for example "2026-10-15T07:00:00.000Z".
let entries = loadEntries();

// When the running timer was started, or null when no timer is running.
let runningSince = null;
// The repeating update of the clock while the timer runs.
let clockTicker = null;
// The id of the entry being edited, or null when none is.
let editingId = null;

// Starts the timer now, or from an earlier moment when we pick up
// a timer that was still running when the page was closed.
function startTimer(since = new Date()) {
  runningSince = since;
  saveRunningTimer();
  clockTicker = setInterval(updateClock, 1000);
  updateTimerBar();
}

function stopTimer() {
  entries.push({
    id: newId(),
    description: descriptionInput.value.trim(),
    start: runningSince.toISOString(),
    end: new Date().toISOString(),
  });
  // The entry is saved before the running timer is cleared, so a crash
  // in between can leave a duplicate, but never lose your time.
  saveEntries(entries);
  saveRunning(null);
  descriptionInput.value = '';

  clearInterval(clockTicker);
  clockTicker = null;
  runningSince = null;
  updateTimerBar();
  renderEntries();
}

function saveRunningTimer() {
  saveRunning({ start: runningSince.toISOString(), description: descriptionInput.value });
}

// A short unique name for an entry, for example "mgq3k1x7a9".
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// The clock always counts from the start time, so it stays correct
// even if the browser updates it late.
function updateClock() {
  const elapsed = runningSince ? Date.now() - runningSince.getTime() : 0;
  clock.textContent = formatDuration(elapsed);
  updateTodayTotal();
}

// Adds up today's entries, plus the running timer if it was started today.
// An entry counts for the day it started on.
function updateTodayTotal() {
  let total = 0;
  for (const entry of entries) {
    const start = new Date(entry.start);
    if (isToday(start)) total += new Date(entry.end) - start;
  }
  if (runningSince && isToday(runningSince)) {
    total += Date.now() - runningSince.getTime();
  }
  todayTotal.textContent = formatDuration(total);
}

function updateTimerBar() {
  const running = runningSince !== null;
  startStopButton.textContent = running ? 'Stop' : 'Start';
  startStopButton.classList.toggle('button-stop', running);
  timerBar.classList.toggle('running', running);
  updateClock();
}

// Shows the entries in the table, newest first.
function renderEntries() {
  const newestFirst = [...entries].sort((a, b) => b.start.localeCompare(a.start));

  entriesBody.replaceChildren(...newestFirst.map(entryRow));
  emptyMessage.hidden = entries.length > 0;
  entriesTable.hidden = entries.length === 0;
  updateTodayTotal();
}

function entryRow(entry) {
  if (entry.id === editingId) return editRow(entry);

  const start = new Date(entry.start);
  const end = new Date(entry.end);

  const row = document.createElement('tr');
  row.append(
    cell(entry.description || '(no description)', entry.description ? 'description' : 'description muted'),
    cell(formatDate(start), 'date'),
    cell(formatTime(start), 'start'),
    cell(formatTime(end), 'end'),
    cell(formatDuration(end - start), 'duration'),
    actionsCell(entry),
  );
  return row;
}

// The buttons at the end of each row. They carry the entry's id,
// so a click knows which entry it is about.
function actionsCell(entry) {
  const td = cell('', 'actions');
  td.append(
    actionButton('Edit', 'edit', entry.id),
    actionButton('Delete', 'delete', entry.id, 'button-danger'),
  );
  return td;
}

function actionButton(label, action, id, extraClass = '') {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `button button-small ${extraClass}`.trim();
  button.textContent = label;
  button.dataset.action = action;
  button.dataset.id = id;
  return button;
}

// The same row, with fields instead of text, and Save and Cancel buttons.
function editRow(entry) {
  const start = new Date(entry.start);
  const end = new Date(entry.end);

  const row = document.createElement('tr');
  row.className = 'editing';
  row.dataset.id = entry.id;
  row.append(
    fieldCell('text', 'description', entry.description, 'Description'),
    fieldCell('date', 'date', toDateFieldValue(start), 'Date'),
    fieldCell('time', 'start', formatTime(start), 'Start'),
    fieldCell('time', 'end', formatTime(end), 'End'),
    cell(formatDuration(end - start), 'duration'),
  );

  const actions = cell('', 'actions');
  actions.append(
    actionButton('Save', 'save', entry.id, 'button-primary'),
    actionButton('Cancel', 'cancel', entry.id),
  );
  row.append(actions);
  return row;
}

function fieldCell(type, field, value, label) {
  const input = document.createElement('input');
  input.type = type;
  input.className = 'edit-field';
  input.value = value;
  input.dataset.field = field;
  input.setAttribute('aria-label', label);

  // On a phone-sized screen the column headings are hidden, so each field shows its name.
  const td = cell('', field);
  td.dataset.label = label;
  td.append(input);
  return td;
}

function startEditing(id) {
  editingId = id;
  renderEntries();
  entriesBody.querySelector('[data-field="description"]').focus();
}

function stopEditing() {
  editingId = null;
  renderEntries();
}

function saveEdit(id) {
  const entry = entries.find((e) => e.id === id);
  const row = entriesBody.querySelector(`tr[data-id="${id}"]`);
  if (!entry || !row) return;

  const field = (name) => row.querySelector(`[data-field="${name}"]`).value;
  const oldStart = new Date(entry.start);
  const oldEnd = new Date(entry.end);

  // The fields only show hours and minutes. A time that wasn't touched keeps
  // its exact original value, seconds included, so editing only the
  // description never changes the duration.
  const dateUnchanged = field('date') === toDateFieldValue(oldStart);
  const start = dateUnchanged && field('start') === formatTime(oldStart)
    ? oldStart
    : fromDateAndTimeFields(field('date'), field('start'));
  const end = dateUnchanged && field('end') === formatTime(oldEnd)
    ? oldEnd
    : fromDateAndTimeFields(field('date'), field('end'));

  const problem = timesProblem(
    { date: field('date'), start: field('start'), end: field('end') }, start, end);
  if (problem) {
    showEditProblem(row, problem);
    return;
  }

  entry.description = field('description').trim();
  entry.start = start.toISOString();
  entry.end = end.toISOString();
  saveEntries(entries);
  stopEditing();
}

// What is wrong with a date, start and end typed in by hand, or null if nothing is.
// Says which field to fix and how. Used both when editing and when adding by hand.
// `values` are the texts in the fields; `start` and `end` are the Dates made from them.
function timesProblem(values, start, end) {
  if (!values.date) return { field: 'date', message: 'Please choose a date.' };
  if (!values.start) return { field: 'start', message: 'Please fill in the start time.' };
  if (!values.end) return { field: 'end', message: 'Please fill in the end time.' };
  if (!start || !end) return { field: 'date', message: 'This date or time is not a real one. Please check it.' };
  if (end <= start) {
    return { field: 'end', message: 'The end time must be after the start time. Entries can\'t go past midnight yet.' };
  }
  return null;
}

// Marks the field that needs fixing, and puts the cursor in it.
function markProblemField(container, problem) {
  unmarkProblemFields(container);
  const input = container.querySelector(`[data-field="${problem.field}"]`);
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

function unmarkProblemFields(container) {
  for (const input of container.querySelectorAll('[aria-invalid]')) {
    input.removeAttribute('aria-invalid');
  }
}

function showManualProblem(problem) {
  markProblemField(manualForm, problem);
  manualError.textContent = problem.message;
  manualError.hidden = false;
}

function clearManualProblem() {
  unmarkProblemFields(manualForm);
  manualError.textContent = '';
  manualError.hidden = true;
}

// While editing, the message goes in a row of its own, right under the row being edited.
function showEditProblem(row, problem) {
  markProblemField(row, problem);

  let messageRow = row.nextElementSibling;
  if (!messageRow || !messageRow.classList.contains('edit-message')) {
    messageRow = document.createElement('tr');
    messageRow.className = 'edit-message';
    const td = document.createElement('td');
    td.colSpan = row.cells.length;
    const message = document.createElement('p');
    message.className = 'form-error';
    message.setAttribute('role', 'alert');
    td.append(message);
    messageRow.append(td);
    row.after(messageRow);
  }
  messageRow.querySelector('.form-error').textContent = problem.message;
}

function clearEditProblem() {
  const row = entriesBody.querySelector('tr.editing');
  if (!row) return;
  unmarkProblemFields(row);
  if (row.nextElementSibling?.classList.contains('edit-message')) row.nextElementSibling.remove();
}

function addManualEntry() {
  const fields = manualForm.elements;
  const start = fromDateAndTimeFields(fields.date.value, fields.start.value);
  const end = fromDateAndTimeFields(fields.date.value, fields.end.value);

  const problem = timesProblem(
    { date: fields.date.value, start: fields.start.value, end: fields.end.value }, start, end);
  if (problem) {
    showManualProblem(problem);
    return;
  }
  clearManualProblem();

  entries.push({
    id: newId(),
    description: fields.description.value.trim(),
    start: start.toISOString(),
    end: end.toISOString(),
  });
  saveEntries(entries);
  renderEntries();

  // Ready for the next one: the date stays, the rest is cleared.
  fields.description.value = '';
  fields.start.value = '';
  fields.end.value = '';
  fields.description.focus();
}

function deleteEntry(id) {
  const entry = entries.find((e) => e.id === id);
  if (!entry) return;

  const name = entry.description || 'this entry';
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;

  entries = entries.filter((e) => e.id !== id);
  if (editingId === id) editingId = null;
  saveEntries(entries);
  renderEntries();
}

function cell(text, className = '') {
  const td = document.createElement('td');
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

startStopButton.addEventListener('click', () => {
  if (runningSince) {
    stopTimer();
  } else {
    startTimer();
  }
});

// One listener for all the buttons in the table, including rows added later.
entriesBody.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  if (action === 'edit') startEditing(id);
  if (action === 'save') saveEdit(id);
  if (action === 'cancel') stopEditing();
  if (action === 'delete') deleteEntry(id);
});

// While editing: Enter in a field saves, Escape cancels.
// (Enter on a button already presses that button.)
entriesBody.addEventListener('keydown', (event) => {
  if (!editingId) return;
  if (event.key === 'Enter' && event.target.matches('.edit-field')) saveEdit(editingId);
  if (event.key === 'Escape') stopEditing();
});

manualForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addManualEntry();
});

// A message goes away as soon as you start fixing what it is about.
manualForm.addEventListener('input', clearManualProblem);
entriesBody.addEventListener('input', clearEditProblem);

// Remember the description of a running timer while you type it.
descriptionInput.addEventListener('input', () => {
  if (runningSince) saveRunningTimer();
});

renderEntries();
manualForm.elements.date.value = toDateFieldValue(new Date());

// A timer that was running when the page was closed keeps running.
const timerLeftRunning = loadRunning();
if (timerLeftRunning) {
  descriptionInput.value = timerLeftRunning.description;
  startTimer(new Date(timerLeftRunning.start));
}
