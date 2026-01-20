import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NGORegistration from "./pages/NGORegistration";
import Donate from "./pages/Donate";
import DonationHistory from "./pages/DonationHistory";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentReturn from "./pages/PaymentReturn";


function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {location.pathname !== "/" && <Navbar />}

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ngo-registration" element={<NGORegistration />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/donations" element={<DonationHistory />} />
          <Route path="/payment-return" element={<PaymentReturn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>

      {location.pathname !== "/" && <Footer />}
    </div>
  );
}

export default App;
