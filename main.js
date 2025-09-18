    const input = document.getElementById("todo-input");
    const todoList = document.getElementById("todo-list");
    const addBtn = document.getElementById("add-btn");
    const delBtn = document.getElementById("clear-btn");
    const activeBtn = document.getElementById("active-btn");
    const completedBtn = document.getElementById("completed-btn");
    const allBtn = document.getElementById("all-btn")


    let tasks = [];
    let currentFilter = "all";


    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    tasks = JSON.parse(saved);
    tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  renderTasks(currentFilter);   // use the current filter instead of hardcoding
  updateClearButtonVisibility();
  updateFilterButtons();
}


    // Build and return an <li> for the given task (no DOM insertion here)
    function renderTask(task) {
      const li = document.createElement("li");

      // left container (checkbox + text)
      const left = document.createElement("div");
      left.className = "left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;

      const span = document.createElement("span");
      span.textContent = task.text;
      if (task.completed) span.classList.add("completed-task");

      left.appendChild(checkbox);
      left.appendChild(span);

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";

      // Event: toggle completion
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        span.classList.toggle("completed-task", task.completed);
        saveTasks();
        updateClearButtonVisibility();
      });

      // Event: delete this task
      deleteBtn.addEventListener("click", () => {
        // remove from array
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        // remove from DOM
        li.remove();
        updateClearButtonVisibility();
      });

      li.appendChild(left);
      li.appendChild(deleteBtn);
      return li;
    }

    // Add a new task object (keeps tasks array newest-first)
    function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask); // newest-first
  saveTasks();

  renderTasks(currentFilter);  // re-render with the active filter
  updateClearButtonVisibility();
}


    // Handler for click or Enter
    function handleAddFromInput() {
      const text = input.value.trim();
      if (!text) return;
      addTask(text);
      input.value = "";
      input.focus();
    }

    // Remove all completed tasks and re-render (preserves tasks array order)
    function removeAllCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();

  renderTasks(currentFilter);  // re-render with the active filter
  updateClearButtonVisibility();
}

function updateFilterButtons() {
  [activeBtn, completedBtn, allBtn].forEach(btn => btn.classList.remove("active"));

  if (currentFilter === "active") activeBtn.classList.add("active");
  if (currentFilter === "completed") completedBtn.classList.add("active");
  if (currentFilter === "all") allBtn.classList.add("active");
}



    // Show/hide "Clear Completed" button
    function updateClearButtonVisibility() {
      const hasCompleted = tasks.some(t => t.completed);
      delBtn.style.display = hasCompleted ? "inline" : "none";
      completedBtn.style.display = hasCompleted ? "inline" : "none";
    }

    // Attach event listeners
    addBtn.addEventListener("click", handleAddFromInput);
    delBtn.addEventListener("click", removeAllCompleted);

    // ENTER key support on input
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddFromInput();
      }
    });

    function renderTasks(filter = "all") {
  todoList.innerHTML = ""; // clear list

  let filteredTasks = tasks;

  if (filter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (filter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  filteredTasks.forEach(task => {
    const li = renderTask(task);
    todoList.appendChild(li);
  });
}
activeBtn.addEventListener("click", () => {
  currentFilter = "active";
  renderTasks(currentFilter);
  updateFilterButtons();
});

completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTasks(currentFilter);
  updateFilterButtons();
});

allBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTasks(currentFilter);
  updateFilterButtons();
});


    // initial load
    loadTasks();