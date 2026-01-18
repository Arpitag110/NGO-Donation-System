import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NGORegistration from "./pages/NGORegistration";
import Donate from "./pages/Donate";
import DonationHistory from "./pages/DonationHistory";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ngo-registration" element={<NGORegistration />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donations" element={<DonationHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
