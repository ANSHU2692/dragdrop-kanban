// ================= STATE =================
let tasksData = {};

const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const columns = [todo, progress, done];

let dragElement = null;

// ================= ADD TASK =================
function addTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  column.appendChild(div);

  // DRAG START
  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  // DRAG END
  div.addEventListener("dragend", () => {
    dragElement = null;
  });

  // DELETE TASK
  div.querySelector("button").addEventListener("click", () => {
    div.remove();
    updateTaskCount();
  });

  return div;
}

// ================= UPDATE COUNT + STORAGE =================
function updateTaskCount() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    tasksData[col.id] = Array.from(tasks).map((t) => ({
      title: t.querySelector("h2").innerText,
      desc: t.querySelector("p").innerText,
    }));

    count.innerText = tasks.length;
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// ================= LOAD FROM STORAGE =================
if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.getElementById(col);

    data[col].forEach((task) => {
      addTask(task.title, task.desc, column);
    });
  }

  updateTaskCount();
}

// ================= DRAG EVENTS =================
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    if (dragElement) {
      column.appendChild(dragElement);
    }

    column.classList.remove("hover-over");
    updateTaskCount();
  });
}

// APPLY DRAG EVENTS
columns.forEach(addDragEventsOnColumn);

// ================= MODAL =================
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const modalAddtaskButton = document.querySelector("#add-new-task");

// OPEN MODAL
toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

// CLOSE MODAL
modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

// ADD NEW TASK
modalAddtaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value.trim();
  const taskDesc = document.querySelector("#task-desc-input").value.trim();

  // PREVENT EMPTY TASK
  if (!taskTitle) return;

  addTask(taskTitle, taskDesc, todo);
  updateTaskCount();

  // CLEAR INPUTS
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";

  modal.classList.remove("active");
});
