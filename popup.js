let pomodoroTime = 25 * 60 * 1000; 
let shortBreakTime = 5 * 60 * 1000; 
let timeLeft = pomodoroTime;
let isRunning = false;
let timer;
let isPomodoro = true; 
let lapCount = 0;

const timerDisplay = document.getElementById('timer-display');
const startPauseButton = document.getElementById('start-pause-btn');
const resetButton = document.getElementById('reset-btn');
const shortBreakButton = document.getElementById('short-break-btn');
const alarmSound = document.getElementById('alarm-sound');

function loadTimerState() {
  const savedState = JSON.parse(localStorage.getItem('pomodoroTimerState'));
  if (savedState) {
    timeLeft = savedState.timeLeft;
    isRunning = savedState.isRunning;
    isPomodoro = savedState.isPomodoro;

    if (isRunning) {
      startPauseTimer(); 
    }
  }
}

function saveTimerState() {
  localStorage.setItem('pomodoroTimerState', JSON.stringify({
    timeLeft: timeLeft,
    isRunning: isRunning,
    isPomodoro: isPomodoro,
  }));
}

function startPauseTimer() {
  if (!isRunning) {
    isRunning = true;
    startPauseButton.textContent = '❚❚'; 
    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft -= 10; 
        updateTimerDisplay();
        saveTimerState(); 
      } else {
        clearInterval(timer);
        isRunning = false;
        timeLeft = isPomodoro ? pomodoroTime : shortBreakTime; 
        updateTimerDisplay();
        startPauseButton.textContent = '►'; 
        alarmSound.play();
        toggleMode(); 
      }
    }, 10);
  } else {
    clearInterval(timer);
    isRunning = false;
    startPauseButton.textContent = '►'; 
    saveTimerState(); 
  }
}

function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = pomodoroTime; 
  isPomodoro = true; 
  updateTimerDisplay();
  startPauseButton.textContent = '►'; 
  document.body.classList.remove('short-break-mode'); 
  saveTimerState(); 
}

function startShortBreak() {
  clearInterval(timer);
  isRunning = false;
  isPomodoro = false;
  timeLeft = shortBreakTime; 
  updateTimerDisplay();
  document.body.classList.add('short-break-mode'); 
  startPauseButton.textContent = '►'; 
  saveTimerState(); 

  lapCount++; 
  displayLapMessage(); 
  saveTimerState(); 
}

function toggleMode() {
  isPomodoro = !isPomodoro;
  timeLeft = isPomodoro ? pomodoroTime : shortBreakTime;
  updateTimerDisplay();

  if (isPomodoro) {
    document.body.classList.remove('short-break-mode');
  } else {
    document.body.classList.add('short-break-mode');
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / (60 * 1000));
  const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);
  const milliseconds = Math.floor((timeLeft % 1000) / 10);
  timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
}
function displayLapMessage() {
  const lapMessage = document.getElementById('lap-message');
  lapMessage.textContent = `${lapCount} lap${lapCount > 1 ? 's' : ''} completed`; // Pluralize if needed
  lapMessage.style.display = 'block'; // Show the message
  setTimeout(() => {
    lapMessage.style.display = 'none'; // Hide the message after 3 seconds
  }, 3000);
}
startPauseButton.addEventListener('click', startPauseTimer);
resetButton.addEventListener('click', resetTimer);
shortBreakButton.addEventListener('click', startShortBreak); 

loadTimerState();

updateTimerDisplay();
