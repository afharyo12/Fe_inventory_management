import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // pilih role
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setError("Pilih role terlebih dahulu!");
      return;
    }

    try {
      const res = await loginUser({ email, password });

      // Simpan token & role ke localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", role);

      // Arahkan sesuai role
      if (role === "admin") navigate("/admin-dashboard");
      else if (role === "manager") navigate("/manager-dashboard");
      else navigate("/dashboard");

    } catch (err) {
      setError("Login gagal, periksa kembali email & password!");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {/* PILIH ROLE */}
        <div style={styles.roleContainer}>
          <label style={styles.label}>Login sebagai:</label>
          <select
            style={styles.select}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Pilih Role --</option>
            <option value="admin">Admin</option>
            <option value="manager">Manajer</option>
            <option value="user">User</option>
          </select>
        </div>

        <form onSubmit={handleLogin}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- STYLE ----------
const styles = {
  container: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f2f2f2",
  },
  card: {
    width: "350px",
    padding: "25px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  label: { fontWeight: "600", marginBottom: "5px", display: "block" },
  roleContainer: { marginBottom: "15px" },
  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: { color: "red", fontSize: "14px", marginTop: "5px" },
};
