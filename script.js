import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://jjaxitqamrxkktiltgdd.supabase.coo";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYXhpdHFhbXJ4a2t0aWx0Z2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTkyNTYsImV4cCI6MjA5MjkzNTI1Nn0.9YorjGmJ7a8m-8JTUyDuTyfZs1GDVE-z483t5iczmfs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ====== ПОЛЬЗОВАТЕЛЬ ======
async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    document.getElementById("user-name").textContent = "Не авторизован";
    return;
  }

  // Имя можно хранить в user_metadata
  const name = user.user_metadata?.name || user.email;

  document.getElementById("user-name").textContent = name;
}

// ====== ТАЙМЕР ======
let seconds = 0;
let interval = null;

function updateTimer() {
  document.getElementById("timer").textContent = seconds + " сек";
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    seconds++;
    updateTimer();
  }, 1000);
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

function stopTimer() {
  clearInterval(interval);
  interval = null;
  seconds = 0;
  updateTimer();
}

// ====== КНОПКИ ======
document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("pause-btn").addEventListener("click", pauseTimer);
document.getElementById("stop-btn").addEventListener("click", stopTimer);

// ====== ИНИЦИАЛИЗАЦИЯ ======
loadUser();
updateTimer();
