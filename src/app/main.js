//global
const todoList = document.querySelector(".todo-list");
const userSelect = document.querySelector("#user-todo");
let todos = [];
let users = [];

//atach events
document.addEventListener("DOMContentLoaded", initApp);
//DOM logic
function createUserOption(user) {
  const option = document.createElement("option");
  option.value = user.id;
  option.innerText = user.name;
  userSelect.append(option);
}

function getUser(userid) {
  console.log(userid);
  const user = users.find((u) => u.id === userid);
  return user.name;
}
function printTodo({ completed, id, title, userId }) {
  const li = document.createElement("li");
  li.classList.add("todo-item");
  li.dataset.id = id;
  li.innerHTML = `<span>${title} by ${getUser(userId)}</span>`;
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  const close = document.createElement("span");
  close.innerHTML = "&times;";
  close.classList.add("close");
  li.prepend(checkbox);
  li.append(close);
  todoList.prepend(li);
}
//event logic
function initApp() {
  Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
    [todos, users] = values;
    console.log(todos);
    todos.forEach((el) => printTodo(el));
    users.forEach((user) => createUserOption(user));
  });
}

//async logic
async function getAllTodos() {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  const data = await response.json();
  return data;
}

async function getAllUsers() {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return data;
}
