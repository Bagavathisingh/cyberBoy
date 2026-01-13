import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./components/Loader";
import "./components/Loader.css";
import Navigation from "./components/Navigation";
import Chatbot from "./pages/Chatbot";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import "./App.css";

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("cyberboy_theme") || "dark";
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(savedTheme);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("cyberboy_user");
    const publicPaths = ["/login", "/register"];
    if (!user && !publicPaths.includes(location.pathname)) {
      navigate("/login", { replace: true });
    }
    if (user && publicPaths.includes(location.pathname)) {
      navigate("/", { replace: true });
    }
    setLoading(true);
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 0);
    return () => clearTimeout(timeout);
  }, [location.pathname, navigate]);

  return (
    <>
      {loading && <Loader />}
      <Navigation />
      <Routes>
        <Route path="/" element={<Chatbot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;
