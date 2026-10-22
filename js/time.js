// Working with time: durations, formatting, "is this today?"

// Turns a number into two digits: 5 becomes "05".
function pad(number) {
  return String(number).padStart(2, '0');
}

// Formats a duration in milliseconds as h:mm:ss, for example 1:05:09.
function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
}

// Formats the time of day on a 24-hour clock, for example 09:05.
function formatTime(date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

// Formats a date the way it is written in Bosnia and Herzegovina, for example 15.10.2026.
function formatDate(date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

// Formats a date without the year, for example 19.10.
function formatShortDate(date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.`;
}

// The same time of day, a number of days later (or earlier, when negative).
// Counting in days, not hours, keeps it right on the nights the clocks change.
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Midnight at the start of the Monday of the week the date is in.
function startOfWeek(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  return addDays(monday, -daysSinceMonday);
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// The heading for a day in the list: "Today", "Yesterday", or for example "Monday, 19.10.2026".
function formatDayHeading(date) {
  if (isToday(date)) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (toDateFieldValue(date) === toDateFieldValue(yesterday)) return 'Yesterday';
  return `${WEEKDAYS[date.getDay()]}, ${formatDate(date)}`;
}

// True when the date falls on today's date, in local time.
function isToday(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}

// The value a date field expects, for example 2026-10-15.
function toDateFieldValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

// Turns the values of a date field and a time field into a Date, in local time.
// Returns null if either is empty or not a real date.
function fromDateAndTimeFields(dateValue, timeValue) {
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);
  const timeParts = /^(\d{2}):(\d{2})$/.exec(timeValue);
  if (!dateParts || !timeParts) return null;

  const [, year, month, day] = dateParts.map(Number);
  const [, hours, minutes] = timeParts.map(Number);
  const date = new Date(year, month - 1, day, hours, minutes);
  return Number.isNaN(date.getTime()) ? null : date;
}
