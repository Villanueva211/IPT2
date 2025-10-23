import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Settings,
  FileBarChart,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700 p-2 rounded flex items-center space-x-2"
      : "hover:bg-blue-700 p-2 rounded flex items-center space-x-2";

  return (
    <div className="w-64 bg-blue-800 text-white flex flex-col">
      <h2 className="text-xl font-bold p-4 border-b border-blue-700">
        Admin Panel
      </h2>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/" className={isActive("/")}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>

        <Link to="/students" className={isActive("/students")}>
          <Users size={18} />
          <span>Students</span>
        </Link>

        <Link to="/faculty" className={isActive("/faculty")}>
          <GraduationCap size={18} />
          <span>Faculty</span>
        </Link>

        <div>
          <button
            onClick={() => setSettingsOpen(!settingsOpen)}
            className="w-full text-left hover:bg-blue-700 p-2 rounded flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <Settings size={18} />
              <span>Settings</span>
            </div>
            <span>{settingsOpen ? "▲" : "▼"}</span>
          </button>

          {settingsOpen && (
            <div className="ml-6 mt-2 space-y-1">
              <Link to="/courses" className={isActive("/courses")}>
                <BookOpen size={18} />
                <span>Courses</span>
              </Link>

              <Link to="/departments" className={isActive("/departments")}>
                <Users size={18} />
                <span>Departments</span>
              </Link>

              <Link to="/academic-years" className={isActive("/academic-years")}>
                <Calendar size={18} />
                <span>Academic Years</span>
              </Link>

              <Link to="/reports" className={isActive("/reports")}>
                <FileBarChart size={18} />
                <span>Reports</span>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <button
        onClick={onLogout}
        className="bg-red-600 p-2 m-4 rounded hover:bg-red-700 flex items-center justify-center space-x-2"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}
