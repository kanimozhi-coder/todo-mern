import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Todo() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

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
    if (!title.trim()) {
      alert("Please enter a todo title");
      return;
    }
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
    if (!editTitle.trim()) {
      alert("Todo title cannot be empty");
    }

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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }
    if (filter === "completed") {
      return todo.completed;
    }
    return true;
  });

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
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        My Todos
      </h1>

      <button
        onClick={handleLogout}
        style={{
          padding: "8px 14px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Logout
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              margin: "25px 0",
            }}
          >
            <button onClick={() => setFilter("all")} disabled={filter === "all"}>
              All
            </button>

            <button onClick={() => setFilter("active")} disabled={filter === "active"}>
              Active
            </button>

            <button onClick={() => setFilter("completed")} disabled={filter === "completed"}>
              Completed
            </button>
          </div>
          {filteredTodos.length === 0 ? (
            <p style={{ textAlign: "center" }}>No todos found.</p>
          ) : (
            <ul style={{ listStyleType: "none" }}>
              {filteredTodos.map((todo, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
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
                    style={{
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    style={{
                      padding: "6px 10px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </ul>
          )}
        </>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter a todo..."
        style={{
          padding: "10px",
          width: "70%",
          marginRight: "10px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      <button
        onClick={handleAddTodo}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Add Todo
      </button>
    </div>
  );
}

export default Todo;
