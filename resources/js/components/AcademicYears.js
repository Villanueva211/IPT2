import React, { useEffect, useState } from "react";
import axios from "axios";

function AcademicYears() {
  const [academicYears, setAcademicYears] = useState([]);
  const [year, setYear] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ✅ Fetch all academic years
  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/academic-years", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcademicYears(response.data);
    } catch (err) {
      console.error("Error fetching academic years:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  // ✅ Handle form submit (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!year.trim()) {
      setError("Academic Year is required.");
      return;
    }

    try {
      const payload = { year };

      if (isEditing) {
        await axios.put(`/api/academic-years/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/academic-years", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setYear("");
      setIsEditing(false);
      setEditingId(null);
      fetchAcademicYears();
    } catch (err) {
      console.error("Error saving academic year:", err);
      setError("Failed to save academic year. Please try again.");
    }
  };

  // ✅ Edit handler
  const handleEdit = (academicYear) => {
    setIsEditing(true);
    setEditingId(academicYear.id);
    setYear(academicYear.year);
  };

  // ✅ Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this academic year?"))
      return;

    try {
      await axios.delete(`/api/academic-years/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAcademicYears();
    } catch (err) {
      console.error("Error deleting academic year:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Academic Year Management
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded p-6 mb-8"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border rounded w-full p-2"
            placeholder="e.g., 2025-2026"
            required
          />
        </div>

        <button
          type="submit"
          className={`${
            isEditing ? "bg-green-600" : "bg-blue-600"
          } text-white px-4 py-2 rounded hover:opacity-90`}
        >
          {isEditing ? "Update Academic Year" : "Add Academic Year"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setEditingId(null);
              setYear("");
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:opacity-90"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Academic Year List
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : academicYears.length === 0 ? (
          <p className="text-gray-500">No academic years found.</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-blue-100 text-left">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Academic Year</th>
                <th className="p-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {academicYears.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{a.id}</td>
                  <td className="p-2 border">{a.year}</td>
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:opacity-90"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AcademicYears;
