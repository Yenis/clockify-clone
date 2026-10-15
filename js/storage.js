// Saving and loading data in the browser (localStorage).
// The data stays in this browser, on this laptop, after the page is closed.

const ENTRIES_KEY = 'time-tracker.entries';

// Returns the saved entries, or an empty list if there are none yet.
// If the browser doesn't allow storage at all, the app still works; it just can't remember.
function loadEntries() {
  try {
    const saved = localStorage.getItem(ENTRIES_KEY);
    if (!saved) return [];

    const entries = JSON.parse(saved);
    return Array.isArray(entries) ? entries.filter(isValidEntry) : [];
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
