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
