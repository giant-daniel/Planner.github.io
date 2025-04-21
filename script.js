const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchTask = document.getElementById("searchTask");
const showAll = document.getElementById("showAll");
const showToday = document.getElementById("showToday");
const showCompleted = document.getElementById("showCompleted");
const exportTasks = document.getElementById("exportTasks");
const importTasks = document.getElementById("importTasks");
const importBtn = document.getElementById("importBtn");
const notificationSound = document.getElementById("notificationSound");

let tasks = [];

function renderTasks(filter = null) {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter((task) => {
    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.date === today;
    } else if (filter === "completed") {
      return task.completed;
    } else if (filter === "search") {
      return task.text.toLowerCase().includes(searchTask.value.toLowerCase());
    }
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${
              task.completed ? "checked" : ""
            } data-index="${index}">
            <span class="task-text">${task.text}</span>
            <span class="task-date">${task.date}</span>
            <span class="task-category">${task.category}</span>
            <span class="task-priority ${task.priority}">${task.priority}</span>
            <button class="delete-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
        `;

    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const date = taskDate.value;
  const category = taskCategory.value;
  const priority = taskPriority.value;

  if (!text || !date) {
    alert("Please enter both task name and date.");
    return;
  }

  tasks.push({ text, date, category, priority, completed: false });
  taskInput.value = "";
  taskDate.value = "";

  playSound();
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
  }
}

function exportToFile() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Daftar Tugas", 14, 20);
  doc.setFontSize(12);

  let y = 30;
  tasks.forEach((task, i) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const status = task.completed ? "Ya" : "Tidak";
    const lines = [
      `${i + 1}. ${task.text}`,
      `   Tanggal   : ${task.date}`,
      `   Kategori  : ${task.category}`,
      `   Prioritas : ${task.priority}`,
      `   Selesai   : ${status}`,
    ];

    lines.forEach((line) => {
      doc.text(line, 14, y);
      y += 7;
    });

    y += 5; // Jarak antar task
  });

  doc.save("tugas.pdf");
}

function importFromFile(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        tasks = data;
        saveTasks();
        renderTasks();
      } else {
        alert("Invalid file format.");
      }
    } catch (error) {
      alert("Error reading file.");
    }
  };
  reader.readAsText(file);
}

function playSound() {
  if (notificationSound) {
    notificationSound.play();
  }
}

// Event Listeners
addTaskBtn.addEventListener("click", addTask);

taskList.addEventListener("click", (e) => {
  const index = e.target.closest("button, input")?.dataset.index;
  if (!index) return;

  if (e.target.closest(".delete-btn")) {
    deleteTask(index);
  } else if (e.target.classList.contains("task-checkbox")) {
    toggleComplete(index);
  }
});

searchTask.addEventListener("input", () => renderTasks("search"));
showAll.addEventListener("click", () => renderTasks());
showToday.addEventListener("click", () => renderTasks("today"));
showCompleted.addEventListener("click", () => renderTasks("completed"));
exportTasks.addEventListener("click", exportToFile);
importBtn.addEventListener("click", () => importTasks.click());
importTasks.addEventListener("change", importFromFile);

// Load tasks on page load
loadTasks();
renderTasks();
