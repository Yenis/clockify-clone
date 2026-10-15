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

// True when the date falls on today's date, in local time.
function isToday(date) {
  const now = new Date();
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate();
}
