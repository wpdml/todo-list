import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post("/user/login", { email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem("token", response.data.token);
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        setError("");
        navigate("/");
      }
      throw new Error(response.message);
    } catch (error) {
      setError(error.message);
    }
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
    particle.style.animation = `glitter ${
      Math.random() * 6 + 2
    }s ease-in-out forwards`;
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
    <div className="display-center">
      <Form className="main-box" onSubmit={handleLogin}>
        <h4>Login</h4>
        <div className="error">{error && <div>{error}</div>}</div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="text-login">Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(event) => setEmail(event.target.value)}
            className="login-bar"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="text-login">Password </Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            className="login-bar"
          />
        </Form.Group>
        <button type="submit" className="button-login">
          Login
        </button>
        <span>
          If you don't have an account{" "}
          <Link to="/register" className="link">
            Register!
          </Link>
        </span>
      </Form>
    </div>
  );
};

export default LoginPage;
