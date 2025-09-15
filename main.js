const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");

let tasks = []; // global array to hold tasks

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load from localStorage
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.forEach(task => renderTask(task));
  }
}

// Render a task into the DOM
function renderTask(task) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.innerText = task.text;
  if (task.completed) {
    span.classList.add("completed-task"); // show as done if saved completed
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Delete";
  deleteBtn.classList.add("delete-btn");

  const completeBtn = document.createElement("button");
  completeBtn.innerText = "Complete";
  completeBtn.classList.add("complete-task");

  // Delete handler
  deleteBtn.addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });

  // Complete handler
  completeBtn.addEventListener("click", () => {
    task.completed = true;
    span.classList.add("completed-task");
    saveTasks();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  li.appendChild(completeBtn);

  todoList.appendChild(li);
}

// Add new task
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(), // unique id
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTask(newTask);

  input.value = "";
});

// Load saved tasks when page starts
loadTasks();