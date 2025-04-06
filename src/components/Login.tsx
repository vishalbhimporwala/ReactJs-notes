import axios from "axios";
import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLoginClick = async () => {
    if (!email || !password) {
      setError("email and password required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const param = email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        ? { email: email, password: password }
        : { userName: email, password: password };

      console.log("Login param : " + JSON.stringify(param));
      console.log("base url : " + baseURL);
      const response = await axios.post(`${baseURL}/user/login`, param);
      console.log("response value : " + JSON.stringify(response));
      if (response.data.success) {
        navigate("/dashboard"); // 👈 navigate on success
      }
    } catch (error) {
      setError("Invalid credential");
      console.log("Login error : " + JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="header">
        <div className="headTitle">Login</div>
      </div>
      <input
        type="text"
        placeholder="Username or email id"
        value={email}
        onChange={(email) => setEmail(email.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(password) => setPassword(password.target.value)}
      />
      {error ? <p>{error}</p> : null}
      <button
        disabled={loading}
        onClick={() => {
          console.log("Login clicked");
          handleLoginClick();
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
