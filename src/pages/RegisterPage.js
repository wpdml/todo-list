import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import api from "../utils/api";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secPassword, setSecPassword] = useState("");
  const [error, setSError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!name) {
        throw new Error("⚠︎ Please enter your name ⚠︎")
      }
      if (name.length>15) {
        throw new Error("⚠︎ Your name must be under 15 characters ⚠︎")
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("⚠︎ Please enter a valid email address ⚠︎");
      }
      if (!email.includes("gmail.com")) {
        throw new Error("⚠︎ Email must contain 'gmail.com' ⚠︎");
      }
      if (!password) {
        throw new Error("⚠︎ Please create a password ⚠︎");
      }
      if (password.length < 6) {
        throw new Error("⚠︎ Password must be at least 6 characters ⚠︎");
      }
      if (!secPassword) {
        throw new Error("⚠︎ Please re-enter the password ⚠︎");
      }
      if (password !== secPassword) {
        throw new Error("⚠︎ Passwords do not match please try again ⚠︎");
      }
      const response = await api.post("/user", { name, email, password });
      if (response.status === 200) {
        sessionStorage.setItem("registrationSuccess", "Registration successful!");
        navigate("/login");
      } else {
        throw new Error(response.data.error);
      }
      console.log("wow!!!", response);
    } catch (error) {
      if (error.response && error.response.status === 409) {
      } else {
        setSError(error.message);
      }
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
      <Form className="main-box" onSubmit={handleSubmit}>
        <h4>Register</h4>
        <div className="error">{error && <div>{error}</div>}</div>
        <Form.Group className="mb-3" controlId="formName">
          <Form.Label className="text-login">Name</Form.Label>
          <Form.Control
            type="string"
            placeholder="Name"
            onChange={(event) => setName(event.target.value)}
            className="login-bar"
          />
        </Form.Group>

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
          <Form.Label className="text-login">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event.target.value)}
            className="login-bar"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="text-login">Re-enter password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter password"
            onChange={(event) => setSecPassword(event.target.value)}
            className="login-bar"
          />
        </Form.Group>

        <button className="button-login" type="submit">
          Register
        </button>
        <span>
          Do you already have an account?{" "}
          <Link to="/login" className="link">
            Login!
          </Link>
        </span>
      </Form>
    </div>
  );
};

export default RegisterPage;
