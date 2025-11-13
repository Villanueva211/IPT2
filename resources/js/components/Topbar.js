import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Topbar() {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [message, setMessage] = useState("");

  // Fetch logged-in user
  useEffect(() => {
    axios
      .get("/api/user")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.put("/api/user/change-password", passwordData);
      setMessage(res.data.message);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setTimeout(() => setShowModal(false), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to update password. Try again."
      );
    }
  };

  return (
    <div className="flex items-center justify-between bg-white shadow px-6 py-3 relative">
      <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

      {/* User Info */}
      {user && (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
            <span className="text-gray-500 ml-1">▼</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
              <button
                onClick={() => {
                  setShowModal(true);
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Change Password Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full border rounded p-2 mb-2"
                value={passwordData.current_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    current_password: e.target.value,
                  })
                }
                required
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full border rounded p-2 mb-2"
                value={passwordData.new_password}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password: e.target.value,
                  })
                }
                required
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full border rounded p-2 mb-2"
                value={passwordData.new_password_confirmation}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    new_password_confirmation: e.target.value,
                  })
                }
                required
              />

              {message && (
                <p className="text-center text-sm text-green-600 mb-2">
                  {message}
                </p>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
