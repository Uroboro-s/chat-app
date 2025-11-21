import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [userid, setUserid] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!userid.trim()) {
      setError("User ID is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    if (password.length < 3) {
      setError("Password must be at least 3 characters");
      return;
    }

    setLoading(true);

    try {
      // For now, just navigate to the chat screen
      // In a real app, you would validate credentials against the backend
      // TODO: Implement proper authentication API call

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Navigate to chat screen with userid
      navigate(`/app/list/${userid}`);
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Messenger</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="userid">User ID</label>
            <input
              id="userid"
              type="text"
              value={userid}
              onChange={(e) => setUserid(e.target.value)}
              placeholder="Enter your user ID"
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div style={{
            marginTop: "1.5rem",
            padding: "1rem",
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "10px",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            textAlign: "center"
          }}>
            <strong>Demo Users:</strong>
            <br />
            harsh / 12345678 | jai / 123 | viral / 1234567
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
