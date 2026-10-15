// Connects the page to the logic: buttons, clock, list of entries.

const descriptionInput = document.getElementById('description');
const clock = document.getElementById('clock');
const startStopButton = document.getElementById('start-stop');

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
  clearInterval(clockTicker);
  clockTicker = null;
  runningSince = null;
  updateTimerBar();
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

startStopButton.addEventListener('click', () => {
  if (runningSince) {
    stopTimer();
  } else {
    startTimer();
  }
});
