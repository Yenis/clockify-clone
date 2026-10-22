// The Reports page: the total for each day of a week, and for the whole week.
// Uses `entries` and `runningSince` from app.js.

const weekTitle = document.getElementById('week-title');
const weekRange = document.getElementById('week-range');
const weekTotal = document.getElementById('week-total');
const weekDays = document.getElementById('week-days');
const previousWeekButton = document.getElementById('previous-week');
const nextWeekButton = document.getElementById('next-week');
const thisWeekButton = document.getElementById('this-week');

// The Monday of the week shown. The report opens on this week.
let shownWeek = startOfWeek(new Date());

// The finished entries, plus the running timer as an entry that ends now.
// The reports count the running timer, the same as today's total.
function entriesWithRunning() {
  if (!runningSince) return entries;
  return [...entries, {
    description: descriptionInput.value.trim(),
    tag: cleanTag(tagInput.value),
    start: runningSince.toISOString(),
    end: new Date().toISOString(),
  }];
}

// The entries that started on or after `from` and before `to`.
// An entry counts for the day it started on, as everywhere in the app.
function entriesBetween(from, to) {
  return entriesWithRunning().filter((entry) => {
    const start = new Date(entry.start);
    return start >= from && start < to;
  });
}

function durationOf(entry) {
  return new Date(entry.end) - new Date(entry.start);
}

function renderReports() {
  const thisWeek = startOfWeek(new Date());
  const weekEnd = addDays(shownWeek, 7);
  const weeksBack = Math.round((thisWeek - shownWeek) / (7 * 24 * 3600 * 1000));

  weekTitle.textContent = weeksBack === 0 ? 'This week' : weeksBack === 1 ? 'Last week' : 'Week';
  weekRange.textContent = `${formatShortDate(shownWeek)} \u2013 ${formatDate(addDays(weekEnd, -1))}`;
  thisWeekButton.disabled = weeksBack === 0;

  // The total for each of the seven days, Monday first.
  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(shownWeek, i);
    const total = entriesBetween(day, addDays(day, 1)).reduce((sum, e) => sum + durationOf(e), 0);
    days.push({ day, total });
  }
  const longest = Math.max(...days.map((d) => d.total));
  weekTotal.textContent = formatDuration(days.reduce((sum, d) => sum + d.total, 0));
  weekDays.replaceChildren(...days.map(({ day, total }) => dayBar(day, total, longest)));
}

// One day of the week: its name, a bar as long as its share of the longest day, and its total.
function dayBar(day, total, longest) {
  const item = document.createElement('li');
  item.className = 'week-day';
  if (isToday(day)) item.classList.add('today');
  if (day > new Date()) item.classList.add('future');

  const name = document.createElement('span');
  name.className = 'week-day-name';
  name.textContent = `${WEEKDAYS[day.getDay()].slice(0, 3)} ${formatShortDate(day)}`;

  const track = document.createElement('span');
  track.className = 'week-day-track';
  const bar = document.createElement('span');
  bar.className = 'week-day-bar';
  bar.style.width = longest > 0 ? `${(total / longest) * 100}%` : '0';
  track.append(bar);

  const value = document.createElement('span');
  value.className = 'week-day-total';
  value.textContent = total > 0 ? formatDuration(total) : '\u2013';

  item.append(name, track, value);
  return item;
}

previousWeekButton.addEventListener('click', () => {
  shownWeek = addDays(shownWeek, -7);
  renderReports();
});

nextWeekButton.addEventListener('click', () => {
  shownWeek = addDays(shownWeek, 7);
  renderReports();
});

thisWeekButton.addEventListener('click', () => {
  shownWeek = startOfWeek(new Date());
  renderReports();
});
