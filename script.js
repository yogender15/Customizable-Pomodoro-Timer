document.addEventListener("DOMContentLoaded", () => {
    // Get elements
    const minutesDisplay = document.getElementById("minutes");
    const secondsDisplay = document.getElementById("seconds");
    const workDurationInput = document.getElementById("work-duration");
    const shortBreakInput = document.getElementById("short-break-duration");
    const longBreakInput = document.getElementById("long-break-duration");
    const cycleCountInput = document.getElementById("cycle-count");
    const sessionTypeDisplay = document.getElementById("session-type");

    const startButton = document.getElementById("start-button");
    const pauseButton = document.getElementById("pause-button");
    const resetButton = document.getElementById("reset-button");

    // Initialize variables
    let timer;
    let isRunning = false;
    let sessionType = "work";
    let cycleCount = 0;

    // Start the timer
    startButton.addEventListener("click", () => {
        if (!isRunning) {
            startTimer();
        }
    });

    // Pause the timer
    pauseButton.addEventListener("click", () => {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
        }
    });

    // Reset the timer
    resetButton.addEventListener("click", resetTimer);

    // Timer logic
    function startTimer() {
        isRunning = true;
        let duration = getSessionDuration();

        let minutes = Math.floor(duration / 60);
        let seconds = duration % 60;
        updateDisplay(minutes, seconds);

        timer = setInterval(() => {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timer);
                    handleSessionEnd();
                } else {
                    minutes--;
                    seconds = 59;
                }
            } else {
                seconds--;
            }
            updateDisplay(minutes, seconds);
        }, 1000);
    }

    function handleSessionEnd() {
        if (sessionType === "work") {
            cycleCount++;
            sessionType = cycleCount % cycleCountInput.value === 0 ? "long break" : "short break";
        } else {
            sessionType = "work";
        }
        sessionTypeDisplay.textContent = `${capitalizeFirstLetter(sessionType)} Session`;
        resetTimer(); // Automatically start the next session
        startTimer();
    }

    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        sessionType = "work";
        cycleCount = 0;
        sessionTypeDisplay.textContent = "Work Session";
        updateDisplay(Math.floor(getSessionDuration() / 60), getSessionDuration() % 60);
    }

    // Helper functions
    function getSessionDuration() {
        if (sessionType === "work") return workDurationInput.value * 60;
        if (sessionType === "short break") return shortBreakInput.value * 60;
        return longBreakInput.value * 60;
    }

    function updateDisplay(minutes, seconds) {
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
