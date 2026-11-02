document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>StudySpace 🌙</h1>
    <p>Your personal study space.</p>

    <div class="study-card">
      <h2>Choose your subject</h2>

      <select id="subject">
        <option value="Physics">Physics</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Biology">Biology</option>
        <option value="Other">Other</option>
      </select>

      <h2 id="currentSubject">Physics</h2>
      <p id="timer">00:00:00</p>

      <button id="startBtn">Start studying</button>
      <button id="pauseBtn">Pause</button>
      <button id="resetBtn">Reset</button>

      <h2>Study time</h2>
      <ul id="subjectTimes"></ul>
    </div>
  `;

  let seconds = 0;
  let interval = null;
  let selectedSubject = "Physics";

  const times = {
    Physics: 0,
    Chemistry: 0,
    Biology: 0,
    Other: 0
  };

  const subjectSelect = document.getElementById("subject");

  subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value;
    document.getElementById("currentSubject").textContent = selectedSubject;
  });

  function updateTimer() {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");

    document.getElementById("timer").textContent = `${h}:${m}:${s}`;
  }

  function updateSubjectTimes() {
    document.getElementById("subjectTimes").innerHTML =
      Object.entries(times)
        .map(([subject, time]) => {
          const h = Math.floor(time / 3600);
          const m = Math.floor((time % 3600) / 60);
          const s = time % 60;
          return `<li>${subject}: ${h}h ${m}m ${s}s</li>`;
        })
        .join("");
  }

  document.getElementById("startBtn").onclick = () => {
    if (interval !== null) return;

    interval = setInterval(() => {
      seconds++;
      times[selectedSubject]++;
      updateTimer();
      updateSubjectTimes();
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
  updateSubjectTimes();
});
