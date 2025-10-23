import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import Sidebar from "./components/Sidebar";

// ✅ Laravel backend base URL
axios.defaults.baseURL = "http://127.0.0.1:8000";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error("Logout failed", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <Login onLogin={setUser} />;

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
