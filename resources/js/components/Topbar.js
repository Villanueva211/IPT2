import React from "react";

export default function Topbar() {
  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-3">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={() => window.location.reload()}
      >
        Logout
      </button>
    </div>
  );
}
