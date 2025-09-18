const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const addBtn = document.getElementById("add-btn");
const delBtn = document.getElementById("clear-btn");

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
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  // const completeBtn = document.createElement("button");
  // completeBtn.innerText = "Complete";
  // completeBtn.classList.add("complete-task");

  // Delete handler
  deleteBtn.addEventListener("click", () => {
    li.remove();
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
  });
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;

checkbox.addEventListener("change", () => {
  task.completed = checkbox.checked;
  span.classList.toggle("completed-task", task.completed);
  saveTasks();
  updateClearButtonVisibility();
});


  // Complete handler
  // completeBtn.addEventListener("click", () => {
  //   // task.completed = true;
  //   span.classList.toggle("completed-task");
  //   task.completed = span.classList.contains("completed-task");
  //   completeBtn.innerText = task.completed ? "Undo": "Complete";
  //   saveTasks();
  //   updateClearButtonVisibility();
  // });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  

  todoList.appendChild(li);
}

// Clear all completed tasks
function removeAllCompleted() {
  // 1. Filter out tasks that are *not completed*
  tasks = tasks.filter(task => !task.completed);

  // 2. Save the updated array
  saveTasks();

  // 3. Clear the list in DOM
  todoList.innerHTML = "";

  // 4. Re-render the remaining tasks
  tasks.forEach(task => renderTask(task));
  updateClearButtonVisibility();
}

// Attach to button
delBtn.addEventListener("click", removeAllCompleted);


// Add new task
addBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (text === "") return;

  const newTask = {
    id: Date.now(), // unique id
    text: text,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(newTask);
  saveTasks();
  renderTask(newTask);

  input.value = "";
});

// Helper to check completed tasks
function updateClearButtonVisibility() {
  const hasCompleted = tasks.some(task => task.completed); // true if at least one
  delBtn.style.display = hasCompleted ? "inline" : "none";
}

// Load saved tasks when page starts
loadTasks();

// After any action (add, delete, complete, undo), call this:
updateClearButtonVisibility();