const SUPABASE_URL = "https://jjaxitqamrxkktiltgdd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYXhpdHFhbXJ4a2t0aWx0Z2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNTkyNTYsImV4cCI6MjA5MjkzNTI1Nn0.9YorjGmJ7a8m-8JTUyDuTyfZs1GDVE-z483t5iczmfs";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const userId = crypto.randomUUID();
const userName = "Alisa";

let startTime = null;

// 🔹 при заходе
async function init() {
  await supabase.from("users").insert({
    id: userId,
    name: userName,
    status: "online",
    last_seen: new Date()
  });
}

init();

// 🔹 онлайн пинг
setInterval(async () => {
  await supabase.from("users")
    .update({
      status: "online",
      last_seen: new Date()
    })
    .eq("id", userId);
}, 10000);

// 🔹 выход
window.addEventListener("beforeunload", async () => {
  await supabase.from("users")
    .update({ status: "offline" })
    .eq("id", userId);
});

// 🔹 загрузка пользователей
async function loadUsers() {
  const { data } = await supabase.from("users").select("*");

  const el = document.getElementById("users");
  el.innerHTML = "";

  data.forEach(user => {
    const isOnline =
      new Date() - new Date(user.last_seen) < 15000;

    el.innerHTML += `
      <div>
        <span class="${isOnline ? 'online' : 'offline'}">●</span>
        ${user.name}
      </div>
    `;
  });
}

setInterval(loadUsers, 3000);

// 🔹 старт учебы
function startStudy() {
  startTime = new Date();
}

// 🔹 стоп учебы
async function stopStudy() {
  if (!startTime) return;

  const sec = Math.floor((new Date() - startTime) / 1000);

  await supabase.from("users")
    .update({ study_time: sec })
    .eq("id", userId);

  startTime = null;
}

// 🔹 таймер
setInterval(() => {
  if (startTime) {
    const sec = Math.floor((new Date() - startTime) / 1000);
    document.getElementById("timer").innerText = sec + " сек";
  }
}, 1000);

// 🔹 отправка сообщения
async function sendMessage() {
  const input = document.getElementById("msg");

  if (!input.value) return;

  await supabase.from("messages").insert({
    user_name: userName,
    text: input.value,
    created_at: new Date()
  });

  input.value = "";
}

// 🔹 загрузка сообщений
async function loadMessages() {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: true });

  const chat = document.getElementById("chat");
  chat.innerHTML = "";

  data.forEach(msg => {
    chat.innerHTML += `
      <div><b>${msg.user_name}:</b> ${msg.text}</div>
    `;
  });
}

setInterval(loadMessages, 2000);
