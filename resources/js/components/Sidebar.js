import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-indigo-700 text-white flex flex-col p-6">
      <h2 className="text-2xl font-bold mb-8 text-center">University Admin</h2>
      <nav className="space-y-4">
        <Link
          to="/"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Dashboard
        </Link>
        <Link
          to="/students"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Students
        </Link>
        <Link
          to="/courses"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Courses
        </Link>
        <Link
          to="/departments"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Departments
        </Link>
        <Link
          to="/faculty"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Faculty
        </Link>

        {/* 🧾 NEW: Reports link */}
        <Link
          to="/reports"
          className="block py-2 px-4 rounded hover:bg-indigo-600 transition"
        >
          Reports
        </Link>
      </nav>
    </div>
  );
}

export default Sidebar;
