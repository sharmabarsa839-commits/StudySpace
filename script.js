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
      <button id="resetBtn">Reset timer</button>
      
      <h2>Study time</h2>
      <ul id="subjectTimes"></ul>
    </div>
  `;

  const saved = JSON.parse(localStorage.getItem("studyspaceData") || "{}");

  let seconds = saved.seconds || 0;
  let interval = null;
  let selectedSubject = saved.selectedSubject || "Physics";

  const times = {
    Physics: saved.times?.Physics || 0,
    Chemistry: saved.times?.Chemistry || 0,
    Biology: saved.times?.Biology || 0,
    Other: saved.times?.Other || 0
  };

  const subjectSelect = document.getElementById("subject");
  subjectSelect.value = selectedSubject;
  document.getElementById("currentSubject").textContent = selectedSubject;
  function saveData() {
    localStorage.setItem("studyspaceData", JSON.stringify({
      seconds,
      selectedSubject,
      times
    }));
  }

  function formatTime(value) {
    const h = String(Math.floor(value / 3600)).padStart(2, "0");
    const m = String(Math.floor((value % 3600) / 60)).padStart(2, "0");
    const s = String(value % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function updateTimer() {
    document.getElementById("timer").textContent = formatTime(seconds);
  }

  function updateSubjectTimes() {
    document.getElementById("subjectTimes").innerHTML =
      Object.entries(times)   .map(([subject, time]) =>
          `<li>${subject}: ${formatTime(time)}</li>`
        )
        .join("");
  }

  subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value;
    document.getElementById("currentSubject").textContent = selectedSubject;
    saveData();
  });

  document.getElementById("startBtn").onclick = () => {
    if (interval !== null) return;

    interval = setInterval(() => {
      seconds++;
      times[selectedSubject]++;
      updateTimer();
      updateSubjectTimes();
      saveData();
    }, 1000);
  };

  document.getElementById("pauseBtn").onclick = () => {
    clearInterval(interval);interval = null;
  };

  document.getElementById("resetBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateTimer();
    saveData();
  };

  updateTimer();
  updateSubjectTimes();
});
