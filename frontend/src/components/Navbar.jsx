import { Link, useNavigate } from "react-router-dom";
import { getToken, removeToken } from "../utils/auth";
import { getUserRole } from "../utils/auth";

function Navbar() {
  const token = getToken();
  const role = getUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="bg-black border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
      <h1 className="text-white text-lg font-semibold">
        NGO Donation System
      </h1>

      <div className="flex items-center space-x-6 text-sm">
        {!token && (
          <>
            <Link to="/" className="text-zinc-300 hover:text-white">
              Login
            </Link>
            <Link to="/register" className="text-zinc-300 hover:text-white">
              Register
            </Link>
          </>
        )}

        {token && role === "USER" && (
          <>
            <Link to="/ngo-registration" className="text-zinc-300 hover:text-white">
              NGO Registration
            </Link>
            <Link to="/donate" className="text-zinc-300 hover:text-white">
              Donate
            </Link>
            <Link to="/donations" className="text-zinc-300 hover:text-white">
              My Donations
            </Link>
            <Link to="/dashboard" className="text-zinc-300 hover:text-white">
              Dashboard
            </Link>
          </>
        )}

        {token && role === "ADMIN" && (
          <>
            <Link to="/admin" className="text-zinc-300 hover:text-white">
              Dashboard
            </Link>
          </>
        )}

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
