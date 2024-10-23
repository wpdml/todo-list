import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, Navigate } from "react-router-dom";
import api from "../utils/api";
import confetti from "canvas-confetti";

const LoginPage = ({ setUser, user }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const success = sessionStorage.getItem("registrationSuccess");
    if (success) {
      setSuccessMessage(success);
      sessionStorage.removeItem("registrationSuccess");
    }
  }, []);

  useEffect(() => {
    if (successMessage) {
      triggerConfetti();
    }
  },[successMessage]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 500,
      spread: 150,
      origin: { y: 0.6 },
      colors: ["#ed6853", "#d1e8d8", "#d0bfdb"],
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      if (!email) {
        throw new Error("⚠︎ Please enter your email address ⚠︎");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("⚠︎ Please enter a valid email address ⚠︎");
      }
      if (!email.includes("gmail.com")) {
        throw new Error("⚠︎ Email must contain 'gmail.com' ⚠︎");
      }
      if (!password) {
        throw new Error("⚠︎ Please enter your password ⚠︎");
      }
      const response = await api.post("/user/login", { email, password });
      if (response.status === 200) {
        setUser(response.data.user);
        sessionStorage.setItem("token", response.data.token);
        api.defaults.headers["authorization"] = "Bearer " + response.data.token;
        setError("");
        navigate("/");
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 420:
            setError("⚠︎ This email is not registered ⚠︎");
            break;
          case 401:
            setError("⚠︎ Wrong password ⚠︎");
            break;
          default:
            setError(
              error.response.data.message ||
                "An error occurred. Please try again."
            );
            break;
        }
      } else {
        setError(error.message || "An error occurred. Please try again.");
      }
    }
    if (user) {
      return <Navigate to="/" />;
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
      {successMessage && (
        <div className="popup-success">
          <p>{successMessage}</p>
          <button onClick={() => setSuccessMessage("")}>Login ➜</button>
        </div>
      )}
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
