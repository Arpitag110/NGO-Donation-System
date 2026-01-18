import { getToken, logout } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = getToken();

  if (!token) {
    return <p>Unauthorized. Please login.</p>;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <h3>User Dashboard</h3>
      <p>You are logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
