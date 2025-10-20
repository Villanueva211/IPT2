import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import axios from "axios";

// Components
import Dashboard from "./components/Dashboard";
import Students from "./components/Students";
import Faculty from "./components/Faculty";
import Departments from "./components/Departments";
import Courses from "./components/Courses";
import AcademicYears from "./components/AcademicYears";
import Reports from "./components/Reports";
import Login from "./components/Login";

// ✅ Laravel backend URL
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;

// ✅ Automatically include token if available
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

function Sidebar({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700 p-2 rounded block"
      : "hover:bg-blue-700 p-2 rounded block";

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-blue-700">
        Admin Panel
      </h2>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={isActive("/")}>
          Dashboard
        </Link>
        <Link to="/students" className={isActive("/students")}>
          Students
        </Link>
        <Link to="/faculty" className={isActive("/faculty")}>
          Faculty
        </Link>

        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full text-left hover:bg-blue-700 p-2 rounded flex justify-between items-center"
          >
            <span>Settings</span>
            <span>{settingsOpen ? "▲" : "▼"}</span>
          </button>

          {settingsOpen && (
            <div className="ml-4 mt-2 space-y-1">
              <Link to="/courses" className={isActive("/courses")}>
                Courses
              </Link>
              <Link to="/departments" className={isActive("/departments")}>
                Departments
              </Link>
              <Link to="/academic-years" className={isActive("/academic-years")}>
                Academic Years
              </Link>
              <Link to="/reports" className={isActive("/reports")}>
                Reports
              </Link>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={onLogout}
        className="bg-red-600 p-2 m-4 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ Reapply token header after login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Logout failed", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/departments" element={<Departments />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/academic-years" element={<AcademicYears />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
