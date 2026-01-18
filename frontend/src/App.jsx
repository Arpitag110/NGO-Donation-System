import { Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NGORegistration from "./pages/NGORegistration";

function App() {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>NGO Registration & Donation System</h2>

      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/">Login</Link> |{" "}
        <Link to="/register">Register</Link> |{" "}
        <Link to="/ngo-registration">NGO Registration</Link> |{" "}
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/ngo-registration" element={<NGORegistration />} />
      </Routes>
    </div>
  );
}

export default App;
