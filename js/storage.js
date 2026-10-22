// Saving and loading data in the browser (localStorage).
// The data stays in this browser, on this laptop, after the page is closed.

const ENTRIES_KEY = 'time-tracker.entries';
const RUNNING_KEY = 'time-tracker.running';

// Returns the saved entries, or an empty list if there are none yet.
// If the browser doesn't allow storage at all, the app still works; it just can't remember.
function loadEntries() {
  try {
    const saved = localStorage.getItem(ENTRIES_KEY);
    if (!saved) return [];

    const entries = JSON.parse(saved);
    if (!Array.isArray(entries)) return [];
    // Entries saved before tags existed get an empty tag.
    return entries.filter(isValidEntry).map((entry) => ({
      ...entry,
      description: String(entry.description ?? ''),
      tag: typeof entry.tag === 'string' ? entry.tag : '',
    }));
  } catch (error) {
    console.error('The saved entries could not be read.', error);
    return [];
  }
}

function saveEntries(entries) {
  try {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('The entries could not be saved.', error);
    alert('Your entries could not be saved in this browser. Please check that the browser allows sites to store data.');
  }
}

// An entry must have an id, a start and an end, all as text.
function isValidEntry(entry) {
  return entry !== null
    && typeof entry === 'object'
    && typeof entry.id === 'string'
    && typeof entry.start === 'string'
    && typeof entry.end === 'string';
}

// Returns the running timer as { start, description, tag }, or null if none is running.
function loadRunning() {
  try {
    const running = JSON.parse(localStorage.getItem(RUNNING_KEY));
    const valid = running !== null
      && typeof running === 'object'
      && typeof running.start === 'string'
      && !Number.isNaN(Date.parse(running.start));
    if (!valid) return null;
    return {
      start: running.start,
      description: String(running.description ?? ''),
      tag: String(running.tag ?? ''),
    };
  } catch (error) {
    console.error('The running timer could not be read.', error);
    return null;
  }
}

// Saves the running timer, or forgets it when given null.
function saveRunning(running) {
  try {
    if (running) {
      localStorage.setItem(RUNNING_KEY, JSON.stringify(running));
    } else {
      localStorage.removeItem(RUNNING_KEY);
    }
  } catch (error) {
    console.error('The running timer could not be saved.', error);
  }
}
