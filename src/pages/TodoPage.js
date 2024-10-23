import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import confetti from "canvas-confetti";
import TodoBoard from "../components/TodoBoard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

function TodoPage({ user, setUser }) {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");
  const [error, setError] = useState("");
  const [logoutPopup, setLogoutPopup] = useState(false);
  const navigate = useNavigate();

  const getTasks = async () => {
    const response = await api.get("/tasks");
    console.log("task list!", response.data.data);
    setTodoList(response.data.data);
  };

  const addTask = async () => {
    const newTask = {
      task: todoValue,
      isComplete: false,
      author: user || { name: "Unknown" },
    };
    if (!todoValue.trim()) {
      setError("⚠︎ Your task must include a character ⚠︎");
      return;
    }

    setTodoList((prevTodoList) => [
      ...prevTodoList,
      { ...newTask, _id: Date.now() },
    ]);

    try {
      const response = await api.post("/tasks", newTask);

      if (response.status === 200) {
        console.log("Success!");
        setTodoValue("");
        setError("");
        getTasks();
      } else {
        setError("⚠︎ Task cannot be added ⚠︎");
      }
    } catch (err) {
      console.log("error", err);
      setError("⚠︎ An error occurred while adding the task ⚠︎");
      getTasks();
    }
  };

  const taskComplete = async (id) => {
    const taskIndex = todoList.findIndex((item) => item._id === id);
    const updatedTask = {
      ...todoList[taskIndex],
      isComplete: !todoList[taskIndex].isComplete,
    };
    const updatedTodoList = [...todoList];
    updatedTodoList[taskIndex] = updatedTask;
    setTodoList(updatedTodoList);

    try {
      const response = await api.put(`/tasks/${id}`, {
        isComplete: updatedTask.isComplete,
      });
      if (response.status !== 200) {
        throw new Error("Failed to update task.");
      }
    } catch (error) {
      console.log("Error:", error);
      getTasks();
    }
  };

  const deleteTask = async (id) => {
    const updatedTodoList = todoList.filter((item) => item._id !== id);
    setTodoList(updatedTodoList);

    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status !== 200) {
        throw new Error("Failed to delete task.");
      }
    } catch (error) {
      console.log("Error deleting task:", error);
      getTasks();
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getTasks();
    }
  }, [user, navigate]);

  const completedTasksCount = todoList.filter((item) => item.isComplete).length;
  const allTasksCompleted =
    todoList.length > 0 && completedTasksCount === todoList.length;

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    api.defaults.headers["authorization"] = "";
    setUser(null);
    navigate("/login");
  };

  const handleLogoutClick = () => {
    setLogoutPopup(true);
  };

  const handleCancelLogout = () => {
    setLogoutPopup(false);
  };

  useEffect(() => {
    if (allTasksCompleted) {
      triggerConfetti();
    }
  }, [allTasksCompleted]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 500,
      spread: 150,
      origin: { y: 0.6 },
      colors: ["#ed6853", "#d1e8d8", "#d0bfdb"],
    });
  };

  const createParticle = () => {
    const particle = document.createElement("div");
    particle.className = "particle";
    const size = Math.random() * 1.5 + 1.3;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.animation = `glitter ${Math.random() * 6 + 2}s ease-in-out forwards`;
    particle.style.zIndex = 1000;
    document.body.appendChild(particle);
    const glowIntensity = Math.random() * 15 + 20;
    particle.style.boxShadow = `0 0 ${glowIntensity}px rgba(255, 255, 255)`;
    particle.addEventListener("animationend", () => {
      particle.remove();
    });
  };

  useEffect(() => {
    const interval = setInterval(createParticle, 80);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glitter-container">
      <div className="box">
        <div className="top-right">
          <div className="welcome">
            <h6>Welcome,</h6>
            <div className="welcome-user"> {user?.name || "Unknown User"}!</div>
          </div>
          <button className="button-logout" onClick={handleLogoutClick}>
            Logout 🔓
          </button>
        </div>
        <Container className="main-box">
          <h1 className={allTasksCompleted ? "glow" : ""}>⭒ TODO LIST ⭒</h1>{" "}
          {todoList.length > 0 && (
            <h3>
              {completedTasksCount === todoList.length
                ? `All ${completedTasksCount} tasks completed! 😆`
                : completedTasksCount > 0
                ? `${completedTasksCount} tasks completed 😊`
                : "No tasks completed yet 🙁"}
            </h3>
          )}
          <Container className="small-box">
            <Row className="add-item-row">
              <Col xs={12} sm={10}>
                <input
                  type="text"
                  placeholder="Enter a task..."
                  className="input-box"
                  value={todoValue}
                  onChange={(event) => setTodoValue(event.target.value)}
                />
              </Col>
              <Col xs={12} sm={2}>
                <button className="button-add" onClick={addTask}>
                  Add
                </button>
              </Col>
            </Row>
          </Container>
          <div className="error">{error && <div>{error}</div>}</div>
          <div className="scroll-box">
            <TodoBoard
              todoList={todoList}
              deleteTask={deleteTask}
              taskComplete={taskComplete}
            />
          </div>
        </Container>
      </div>
      {logoutPopup && (
        <div className="popup-logout">
          <p>Do you really want to logout?</p>
          <div className="logout-buttons">
          <button className="button-cancel" onClick={handleCancelLogout}>
            Cancel
          </button>
          <button className="button-confirm-logout" onClick={handleLogout}>
            Logout
          </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoPage;
