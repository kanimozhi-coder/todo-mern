import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    navigate("/login");
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

  const handleUpdateTodo = async (todoId) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:5000/api/todos/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editTitle,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      alert(data.message);
      return;
    }

    setTodos((prevTodos) => prevTodos.map((item) => (item._id === data.todo._id ? data.todo : item)));

    setEditingId(null);
    setEditTitle("");
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
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchTodos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message);
          setLoading(false);
          return;
        }

        setTodos(data.todos);
        setLoading(false);
      } catch (error) {
        setError("Failed to load todos");
        setLoading(false);
      }
    };
    fetchTodos();
  }, [navigate]);
  return (
    <div>
      <h1>My Todos</h1>

      <button onClick={handleLogout}>Logout</button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul style={{ listStyleType: "none" }}>
          {todos.map((todo, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <li key={todo._id}>
                <input type="checkbox" checked={todo.completed} onChange={() => handleToggleTodo(todo)} />

                {editingId === todo._id ? (
                  <>
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <button onClick={() => handleUpdateTodo(todo._id)}>Save</button>
                  </>
                ) : todo.completed ? (
                  <span style={{ textDecoration: "line-through" }}>{todo.title}</span>
                ) : (
                  <span>{todo.title}</span>
                )}
              </li>

              <button
                onClick={() => {
                  setEditingId(todo._id);
                  setEditTitle(todo.title);
                }}
              >
                Edit
              </button>

              <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
            </div>
          ))}
        </ul>
      )}
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a todo" />

      <button onClick={handleAddTodo}>Add Todo</button>
    </div>
  );
}

export default Todo;
