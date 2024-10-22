import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";
import { useEffect, useState } from "react";
import RegisterPage from "./pages/RegisterPage";
import api from "./utils/api";
import PrivateRoute from "./route/PrivateRoute";

function App() {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        api.defaults.headers["authorization"] = "Bearer " + storedToken;
        const response = await api.get("/user");
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute user={user}>
            <TodoPage user={user} setUser={setUser} />
          </PrivateRoute>
        }
      />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/" replace /> : <LoginPage setUser={setUser} />
        }
      />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;
