document.addEventListener("DOMContentLoaded", () => {
  loadTicketsFromLocalStorage();
});

const addButton = document.querySelector(".add_button");
const deleteButton = document.querySelector(".delete_button");
const modal = document.querySelector(".model_container");
const priorityColors = document.querySelectorAll(".priority_color");
const textArea = document.querySelector(".textarea_container");
const toolboxPriority = Array.from(
  document.querySelector(".toolbox-priority").children
);

let ticketArray = JSON.parse(localStorage.getItem("ticketArray")) || [];


deleteButton.addEventListener("click", () => {
  deleteButton.children[0].classList.toggle("red");
});

toolboxPriority.forEach((priority) => {
  const color = priority.classList[1];

  priority.addEventListener("click", () => {
    filterTicketsByColor(color);
  });

  priority.addEventListener("dblclick", showAllTickets);
});

addButton.addEventListener("click", () => {
  modal.style.display = "flex";
});

modal.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    modal.style.display = "none";
  }
});

priorityColors.forEach((color) => {
  color.addEventListener("click", (e) => {
    setActivePriorityColor(e.target);
    const selectedColor = e.target.classList[1];
    const content = textArea.value;
    createTicket(selectedColor, content);
    textArea.value = "";
    modal.style.display = "none";
  });
});

function filterTicketsByColor(color) {
  const allTickets = document.querySelectorAll(".ticket_container");
  allTickets.forEach((ticket) => {
    const ticketColor = ticket.children[0].style.backgroundColor;
    ticket.style.display = ticketColor === color ? "block" : "none";
  });
}

function showAllTickets() {
  const allTickets = document.querySelectorAll(".ticket_container");
  allTickets.forEach((ticket) => {
    ticket.style.display = "block";
  });
}

function setActivePriorityColor(target) {
  priorityColors.forEach((color) => {
    color.classList.remove("active");
  });
  target.classList.add("active");
}

function createTicket(priority, content, id = Date.now().toString()) {
  const ticket = document.createElement("div");
  ticket.classList.add("ticket_container");

  const ticketColor = document.createElement("div");
  ticketColor.classList.add("ticket_color");
  ticketColor.style.backgroundColor = priority;

  const ticketId = document.createElement("div");
  ticketId.classList.add("ticket_id");
  ticketId.textContent = `#${id}`;

  const ticketArea = document.createElement("div");
  ticketArea.classList.add("ticket_area");
  ticketArea.textContent = content;

  const lockUnlock = document.createElement("div");
  lockUnlock.classList.add("lock_unlock");
  lockUnlock.innerHTML = `<i class="fas fa-lock"></i>`;

  ticket.append(ticketColor, ticketId, ticketArea, lockUnlock);
  document.querySelector(".pending_count").appendChild(ticket);

  ticketColor.addEventListener("click", (e) => {
    cycleTicketColor(e.target);
  });

  ticket.addEventListener("click", (e) => {
    if (deleteButton.children[0].classList.contains("red")) {
      e.currentTarget.remove();
      ticketArray = ticketArray.filter(ticket => ticket.id !== id);
      localStorage.setItem("ticketArray", JSON.stringify(ticketArray));
    }
  });

  // lock and unlock ticket
  lockUnlock.addEventListener("click", (e) => {
    const lockUnlockIcon = e.target;
    lockUnlockIcon.classList.toggle("fa-lock");
    lockUnlockIcon.classList.toggle("fa-unlock");
    ticketArea.contentEditable =
      ticketArea.contentEditable === "true" ? "false" : "true";
  });

  if (!ticketArray.some(ticket => ticket.id === id)) {
    ticketArray.push({ id, priority, content });
    localStorage.setItem("ticketArray", JSON.stringify(ticketArray));
  }
}

function cycleTicketColor(target) {
  const colors = ["pink", "blue", "green", "purple"];
  const currentColor = target.style.backgroundColor;
  let idx = colors.indexOf(currentColor);
  idx = (idx + 1) % colors.length;
  target.style.backgroundColor = colors[idx];
}

function loadTicketsFromLocalStorage() {
  const tickets = JSON.parse(localStorage.getItem("ticketArray")) || [];
  tickets.forEach(ticket => {
    createTicket(ticket.priority, ticket.content, ticket.id);
  });
}
