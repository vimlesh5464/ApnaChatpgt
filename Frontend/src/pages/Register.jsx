import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        alert("All fields are required");
        return;
      }

      const data = await registerUser(name, email, password);

      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/login");
      } else {
        alert(data.detail || "Register failed");
      }
    } catch (err) {
      alert(err.message || "Register failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">

        <h2>Create Account</h2>

        <input
          className="input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn" onClick={handleRegister}>
          Register
        </button>

        <p className="login-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;