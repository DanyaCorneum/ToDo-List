(function () {
  //global
  const todoList = document.querySelector(".todo-list");
  const userSelect = document.querySelector("#user-todo");
  const form = document.querySelector("#form");
  let todos = [];
  let users = [];

  //atach events
  document.addEventListener("DOMContentLoaded", initApp);
  form.addEventListener("submit", handleSubmit);
  //DOM logic
  function createUserOption(user) {
    const option = document.createElement("option");
    option.value = user.id;
    option.innerText = user.name;
    userSelect.append(option);
  }

  function getUser(userid) {
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
    checkbox.addEventListener(
      "change",
      changeStatus({ completed, id, title, userId })
    );
    close.addEventListener("click", removeTodo(id));
  }
  function changeStatus(todo) {
    function change() {
      const status = this.checked;
      changeStatusResp(todo, status);
    }
    return change;
  }
  function removeTodo(id) {
    function close(event) {
      const todo = event.target.parentNode;
      todo.parentNode.removeChild(todo);
      todos = todos.filter((t) => t.id !== id);
      closeTodo(id);
    }
    return close;
  }

  //event logic
  function handleSubmit(event) {
    event.preventDefault();
    createTodo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    });
  }

  function initApp() {
    Promise.all([getAllTodos(), getAllUsers()]).then((values) => {
      [todos, users] = values;
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

  async function createTodo(todo) {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const todoContent = await response.json();
    console.log(todo);
    printTodo(todoContent);
  }
  async function changeStatusResp(todo, status) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({ completed: status }),
        headers: { "Content-type": "application/json" },
      }
    );
    await getAllTodos();
    console.log(await response.json());
    if (!response.ok) {
      throw Error("Something is wrong");
    }
  }
  async function closeTodo(id) {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${id}`,
      {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      }
    );
    console.log(await response.json());
    if (!response.ok) {
      throw Error("Something is wrong");
    }
  }
})();
