document.addEventListener("DOMContentLoaded", () => {
  // --- Элементы DOM ---
  const list = document.getElementById("taskList");
  const input = document.getElementById("taskInput");
  const addBtn = document.getElementById("addBtn");
  const categorySelect = document.getElementById("category");
  const counter = document.getElementById("taskCounter");
  const themeBtn = document.getElementById("themeToggle");

  // --- Состояние приложения ---
  let tasks = [];

  // --- Загрузка из localStorage ---
  try {
    const saved = localStorage.getItem("tasks");
    tasks = saved ? JSON.parse(saved) : [];
  } catch {
    localStorage.removeItem("tasks");
    tasks = [];
  }

  // --- ТЕМА: Инициализация и переключение ---
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      themeBtn.textContent = "☀️";
    } else {
      themeBtn.textContent = "🌙";
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️" : "🌙";
  }

  // --- Обработчики событий ---
  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
  });
  themeBtn.addEventListener("click", toggleTheme);

  // --- Функции ---
  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const task = {
      id: Date.now(),
      text: text,
      done: false,
      category: categorySelect.value,
    };

    tasks.push(task);
    input.value = "";
    save();
    render();
  }

  function toggleTask(id) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    save();
    render();
  }

  function removeTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    save();
    render();
  }

  // --- Рендер ---
  function render() {
    list.innerHTML = "";

    tasks.forEach((task) => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      li.innerHTML = `
        <div>
          <span class="text">${task.text}</span>
          <span class="tag ${task.category}">
            ${task.category}
          </span>
        </div>
        <button class="delete">X</button>
      `;

      li.querySelector(".text").addEventListener("click", () => toggleTask(task.id));
      li.querySelector(".delete").addEventListener("click", () => removeTask(task.id));

      list.appendChild(li);
    });

    updateCounter();
  }

  function updateCounter() {
    const done = tasks.filter((t) => t.done).length;
    counter.textContent = `${done}/${tasks.length} completed`;
  }

  function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // --- Регистрация Service Worker для PWA ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered:', reg))
      .catch(err => console.log('SW registration failed:', err));
  }

  // --- Старт приложения ---
  initTheme();
  render();
});