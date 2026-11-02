document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>StudySpace 🌙</h1>
    <p>Your personal study space.</p>

    <div class="study-card">
      <h2>Ready to study?</h2>
      <p id="timer">00:00:00</p>

      <button id="startBtn">Start studying</button>
      <button id="pauseBtn">Pause</button>
      <button id="resetBtn">Reset</button>
    </div>
  `;

  let seconds = 0;
  let interval = null;

  function updateTimer() {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");

    document.getElementById("timer").textContent =
      `${hours}:${minutes}:${secs}`;
  }

  document.getElementById("startBtn").onclick = () => {
    if (interval !== null) return;

    interval = setInterval(() => {
      seconds++;
      updateTimer();
    }, 1000);
  };

  document.getElementById("pauseBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
  };

  document.getElementById("resetBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateTimer();
  };

  updateTimer();
});
