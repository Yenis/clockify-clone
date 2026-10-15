// Connects the page to the logic: buttons, clock, list of entries.

const descriptionInput = document.getElementById('description');
const clock = document.getElementById('clock');
const startStopButton = document.getElementById('start-stop');
const emptyMessage = document.getElementById('empty-message');
const entriesTable = document.getElementById('entries-table');
const entriesBody = document.getElementById('entries-body');
const todayTotal = document.getElementById('today-total');

// All finished entries: { id, description, start, end }.
// start and end are stored as ISO text, for example "2026-10-15T07:00:00.000Z".
let entries = loadEntries();

// When the running timer was started, or null when no timer is running.
let runningSince = null;
// The repeating update of the clock while the timer runs.
let clockTicker = null;

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

// Remember the description of a running timer while you type it.
descriptionInput.addEventListener('input', () => {
  if (runningSince) saveRunningTimer();
});

renderEntries();

// A timer that was running when the page was closed keeps running.
const timerLeftRunning = loadRunning();
if (timerLeftRunning) {
  descriptionInput.value = timerLeftRunning.description;
  startTimer(new Date(timerLeftRunning.start));
}
