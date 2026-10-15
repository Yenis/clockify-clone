// Connects the page to the logic: buttons, clock, list of entries.

const descriptionInput = document.getElementById('description');
const clock = document.getElementById('clock');
const startStopButton = document.getElementById('start-stop');
const emptyMessage = document.getElementById('empty-message');
const entriesTable = document.getElementById('entries-table');
const entriesBody = document.getElementById('entries-body');

// All finished entries: { id, description, start, end }.
// start and end are stored as ISO text, for example "2026-10-15T07:00:00.000Z".
let entries = [];

// When the running timer was started, or null when no timer is running.
let runningSince = null;
// The repeating update of the clock while the timer runs.
let clockTicker = null;

function startTimer() {
  runningSince = new Date();
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
  descriptionInput.value = '';

  clearInterval(clockTicker);
  clockTicker = null;
  runningSince = null;
  updateTimerBar();
  renderEntries();
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
}

function updateTimerBar() {
  const running = runningSince !== null;
  startStopButton.textContent = running ? 'Stop' : 'Start';
  startStopButton.classList.toggle('button-stop', running);
  updateClock();
}

// Shows the entries in the table, newest first.
function renderEntries() {
  const newestFirst = [...entries].sort((a, b) => b.start.localeCompare(a.start));

  entriesBody.replaceChildren(...newestFirst.map(entryRow));
  emptyMessage.hidden = entries.length > 0;
  entriesTable.hidden = entries.length === 0;
}

function entryRow(entry) {
  const start = new Date(entry.start);
  const end = new Date(entry.end);

  const row = document.createElement('tr');
  row.append(
    cell(entry.description || '(no description)', entry.description ? '' : 'muted'),
    cell(formatDate(start)),
    cell(formatTime(start)),
    cell(formatTime(end)),
    cell(formatDuration(end - start), 'duration'),
  );
  return row;
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
