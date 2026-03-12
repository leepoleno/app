document.addEventListener("DOMContentLoaded", () => {
    // --- Элементы DOM ---
    const list = document.getElementById("taskList");
    const input = document.getElementById("taskInput");
    const addBtn = document.getElementById("addBtn");
    const prioritySelect = document.getElementById("priority");
    const counter = document.getElementById("taskCounter");
    const themeBtn = document.getElementById("themeToggle");
    const tabs = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    
    // Элементы профиля
    const profileForm = document.getElementById("profileForm");
    const nameInput = document.getElementById("nameInput");
    const cityInput = document.getElementById("cityInput");
    const emailInput = document.getElementById("emailInput");
    const phoneInput = document.getElementById("phoneInput");
    const profileName = document.getElementById("profileName");
    const avatar = document.getElementById("avatar");
    const avatarInput = document.getElementById("avatarInput");
    const changeAvatarBtn = document.getElementById("changeAvatarBtn");
    
    // Элементы статистики
    const totalTasksSpan = document.getElementById("totalTasks");
    const completedTasksSpan = document.getElementById("completedTasks");
    const completionRateSpan = document.getElementById("completionRate");

    // --- Состояние приложения ---
    let tasks = [];
    let profile = {
        name: "",
        city: "",
        email: "",
        phone: "",
        avatar: ""
    };

    // --- Загрузка из localStorage ---
    function loadFromStorage() {
        // Загрузка задач
        try {
            const savedTasks = localStorage.getItem("tasks");
            tasks = savedTasks ? JSON.parse(savedTasks) : [];
        } catch {
            tasks = [];
        }
        
        // Загрузка профиля
        try {
            const savedProfile = localStorage.getItem("profile");
            if (savedProfile) {
                profile = JSON.parse(savedProfile);
                updateProfileUI();
            }
        } catch {
            console.log("No profile data");
        }
    }

    // --- ТЕМА ---
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

    // --- Управление вкладками ---
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Убираем активный класс у всех вкладок
            tabs.forEach(t => t.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));
            
            // Добавляем активный класс текущей вкладке
            tab.classList.add("active");
            const tabId = tab.dataset.tab;
            document.getElementById(`${tabId}-tab`).classList.add("active");
        });
    });

    // --- Работа с задачами ---
    function addTask() {
        const text = input.value.trim();
        if (!text) {
            alert("Введите текст задачи!");
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            done: false,
            priority: prioritySelect.value,
            date: new Date().toISOString().split('T')[0]
        };

        tasks.push(task);
        input.value = "";
        saveTasks();
        renderTasks();
    }

    function toggleTask(id) {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, done: !t.done } : t
        );
        saveTasks();
        renderTasks();
    }

    function removeTask(id) {
        if (confirm("Удалить задачу?")) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
    }

    function renderTasks() {
        list.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");
            if (task.done) li.classList.add("done");

            li.innerHTML = `
                <div class="task-content">
                    <span class="text">${task.text}</span>
                    <span class="priority-tag ${task.priority}">
                        ${getPriorityName(task.priority)}
                    </span>
                </div>
                <button class="delete">✕</button>
            `;

            li.querySelector(".text").addEventListener("click", () => toggleTask(task.id));
            li.querySelector(".delete").addEventListener("click", () => removeTask(task.id));

            list.appendChild(li);
        });

        updateTaskCounter();
        updateProfileStats();
    }

    function getPriorityName(priority) {
        const names = {
            normal: "Normal",
            urgent: "Urgent",
            "long-term": "Long-term"
        };
        return names[priority] || priority;
    }

    function updateTaskCounter() {
        const done = tasks.filter(t => t.done).length;
        counter.textContent = `${done}/${tasks.length} выполнено`;
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // --- Работа с профилем ---
    function updateProfileUI() {
        if (profile.name) {
            profileName.textContent = profile.name;
            nameInput.value = profile.name;
        }
        if (profile.city) cityInput.value = profile.city;
        if (profile.email) emailInput.value = profile.email;
        if (profile.phone) phoneInput.value = profile.phone;
        
        if (profile.avatar) {
            avatar.src = profile.avatar;
        } else {
            avatar.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23667eea'/%3E%3Ctext x='50' y='70' font-size='40' text-anchor='middle' fill='white' font-family='Arial'%3E👤%3C/text%3E%3C/svg%3E";
        }
    }

    function saveProfile(event) {
        event.preventDefault();
        
        // Валидация email
        const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            alert("Введите корректный email!");
            return;
        }
        
        // Валидация телефона
        const phoneRegex = /\+7\s?[\(]?\d{3}[\)]?\s?\d{3}[\s-]?\d{2}[\s-]?\d{2}/;
        if (phoneInput.value && !phoneRegex.test(phoneInput.value)) {
            alert("Введите телефон в формате: +7 (999) 999-99-99");
            return;
        }
        
        profile = {
            ...profile,
            name: nameInput.value,
            city: cityInput.value,
            email: emailInput.value,
            phone: phoneInput.value
        };
        
        localStorage.setItem("profile", JSON.stringify(profile));
        updateProfileUI();
        alert("Профиль сохранен!");
    }

    function updateProfileStats() {
        if (totalTasksSpan && completedTasksSpan && completionRateSpan) {
            const total = tasks.length;
            const completed = tasks.filter(t => t.done).length;
            const rate = total ? Math.round((completed / total) * 100) : 0;
            
            totalTasksSpan.textContent = total;
            completedTasksSpan.textContent = completed;
            completionRateSpan.textContent = `${rate}%`;
        }
    }

    // --- Работа с аватаром ---
    function handleAvatarChange(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profile.avatar = e.target.result;
                avatar.src = e.target.result;
                localStorage.setItem("profile", JSON.stringify(profile));
            };
            reader.readAsDataURL(file);
        }
    }

    // --- Обработчики событий ---
    addBtn.addEventListener("click", addTask);
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") addTask();
    });
    themeBtn.addEventListener("click", toggleTheme);
    profileForm.addEventListener("submit", saveProfile);
    changeAvatarBtn.addEventListener("click", () => avatarInput.click());
    avatarInput.addEventListener("change", handleAvatarChange);

    // --- Регистрация Service Worker ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW зарегистрирован:', reg))
            .catch(err => console.log('SW регистрация не удалась:', err));
    }

    // --- Инициализация ---
    loadFromStorage();
    initTheme();
    renderTasks();
    updateProfileStats();
});