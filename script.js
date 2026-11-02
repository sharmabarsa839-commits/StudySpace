document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  app.innerHTML = `
    <h1>StudySpace 🌙</h1>
    <p>Your personal study space.</p>
<div class="quote">“Even the moon takes its time to shine.” 🌙</div>

    <div class="study-card">
      <h2>Choose your subject</h2>
      <select id="subject">
        <option>Physics</option>
        <option>Chemistry</option>
        <option>Biology</option>
        <option>Other</option>
      </select>

      <h2 id="currentSubject">Physics</h2>
      <p id="timer">00:00:00</p>

      <button id="startBtn">Start studying</button>
      <button id="pauseBtn">Pause</button>
      <button id="resetBtn">Reset timer</button>

      <h2>Study statistics</h2>
      <p>Today: <span id="daily">00:00:00</span></p>
      <p>This week: <span id="weekly">00:00:00</span></p>
      <p>This month: <span id="monthly">00:00:00</span></p>

      <h2>Subject-wise time</h2>
      <ul id="subjectTimes"></ul>

      <h2>🏆 Your rewards</h2>
      <p>Coins: 🪙 <span id="coins">0</span></p>
      <p>Level: <span id="level">Level 1 - Beginner</span></p>
      <p id="nextLevel"></p>
    </div>
  `;

  const old = JSON.parse(localStorage.getItem("studyspaceData") || "{}");

  let seconds = old.seconds || 0;
  let selectedSubject = old.selectedSubject || "Physics";
  let interval = null;

  const subjects = ["Physics", "Chemistry", "Biology", "Other"];
  const daily = old.daily || {};
  const legacy = old.legacy || old.times || {};

  function dateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  function formatTime(value) {
    const h = Math.floor(value / 3600);
    const m = Math.floor((value % 3600) / 60);
    const s = value % 60;
    return [h, m, s].map(n => String(n).padStart(2, "0")).join(":");
  }

  function dayTotal(key) {
    return subjects.reduce((sum, subject) =>
      sum + (daily[key]?.[subject] || 0), 0);
  }

  function getWeekKeys() {
    const today = new Date();
    const monday = new Date(today);
    const day = (today.getDay() + 6) % 7;
    monday.setDate(today.getDate() - day);

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      return dateKey(date);
    });
  }

  function getAllTimeSeconds() {
    const dailySeconds = Object.values(daily).reduce((sum, record) =>
      sum + subjects.reduce((total, subject) =>
        total + (record[subject] || 0), 0), 0);

    const legacySeconds = subjects.reduce((sum, subject) =>
      sum + (legacy[subject] || 0), 0);

    return dailySeconds + legacySeconds;
  }

  function updateRewards() {
    const coins = Math.floor(getAllTimeSeconds() / 3600) * 10;

    const levels = [
      { name: "Level 1 - Beginner", coins: 0 },
      { name: "Level 2 - Focused", coins: 200 },
      { name: "Level 3 - Dedicated", coins: 500 },
      { name: "Level 4 - Scholar", coins: 1000 },
      { name: "Level 5 - Mastermind", coins: 2000 }
    ];

    let currentLevel = levels[0];

    for (const level of levels) {
      if (coins >= level.coins) currentLevel = level;
    }

    const nextLevel = levels.find(level => level.coins > coins);

    document.getElementById("coins").textContent = coins;
    document.getElementById("level").textContent = currentLevel.name;

    document.getElementById("nextLevel").textContent = nextLevel
      ? `${nextLevel.coins - coins} more coins to reach ${nextLevel.name}`
      : "You've reached the highest level! 🎉";
  }

  function updateStats() {
    const today = new Date();
    const todayKey = dateKey(today);

    const dailyTotal = dayTotal(todayKey);
    const weeklyTotal = getWeekKeys().reduce((sum, key) =>
      sum + dayTotal(key), 0);

    const monthPrefix =
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    const monthlyTotal = Object.keys(daily)
      .filter(key => key.startsWith(monthPrefix))
      .reduce((sum, key) => sum + dayTotal(key), 0);

    document.getElementById("daily").textContent = formatTime(dailyTotal);
    document.getElementById("weekly").textContent = formatTime(weeklyTotal);
    document.getElementById("monthly").textContent = formatTime(monthlyTotal);

    const totals = {};

    subjects.forEach(subject => {
      totals[subject] = (legacy[subject] || 0) +
        Object.values(daily).reduce((sum, record) =>
          sum + (record[subject] || 0), 0);
    });

    document.getElementById("subjectTimes").innerHTML =
      subjects.map(subject =>
        `<li>${subject}: ${formatTime(totals[subject])}</li>`
      ).join("");

    updateRewards();
  }

  function saveData() {
    localStorage.setItem("studyspaceData", JSON.stringify({
      seconds,
      selectedSubject,
      daily,
      legacy
    }));
  }

  function updateTimer() {
    document.getElementById("timer").textContent = formatTime(seconds);
  }

  const subjectSelect = document.getElementById("subject");
  subjectSelect.value = selectedSubject;
  document.getElementById("currentSubject").textContent = selectedSubject;

  subjectSelect.addEventListener("change", () => {
    selectedSubject = subjectSelect.value;
    document.getElementById("currentSubject").textContent = selectedSubject;
    saveData();
  });

  document.getElementById("startBtn").onclick = () => {
    if (interval !== null) return;

    interval = setInterval(() => {
      seconds++;

      const key = dateKey(new Date());
      if (!daily[key]) daily[key] = {};

      daily[key][selectedSubject] =
        (daily[key][selectedSubject] || 0) + 1;

      updateTimer();
      updateStats();
      saveData();
    }, 1000);
  };

  document.getElementById("pauseBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
    saveData();
  };

  document.getElementById("resetBtn").onclick = () => {
    clearInterval(interval);
    interval = null;
    seconds = 0;
    updateTimer();
    saveData();
  };

  updateTimer();
  updateStats();
});
