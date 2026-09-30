import { useEffect, useState } from "react";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const handleDeleteTodo = async (todoId) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    setTodos((prevTodos) => prevTodos.filter((item) => item._id !== todoId));
    console.log(data);
  };

  const handleAddTodo = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
      }),
    });
    const data = await response.json();

    console.log(data);

    setTodos((prevTodos) => [...prevTodos, data.todo]);
    setTitle("");
  };

  const handleToggleTodo = async (todo) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/todos/${todo._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        completed: !todo.completed,
      }),
    });
    const data = await response.json();

    setTodos((prevTodos) => prevTodos.map((item) => (item._id === data.todo._id ? data.todo : item)));

    console.log(data);
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      setTodos(data.todos);
    };
    fetchTodos();
  }, []);
  return (
    <div>
      <h1>My Todos</h1>

      <ul style={{ listStyleType: "none" }}>
        {todos.map((todo, index) => (
          <div key={index} style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "10px" }}>
            <li key={todo._id}>
              <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo)} />
              {todo.completed ? <span style={{ textDecoration: "line-through" }}>{todo.title}</span> : <span>{todo.title}</span>}
            </li>
            <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
            {/* <button>close</button> */}
          </div>
        ))}
      </ul>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a todo" />

      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
}

export default Todo;
