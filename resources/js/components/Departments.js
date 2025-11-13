import React, { useState, useEffect } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [editing, setEditing] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
  }, [showArchived]);

  const fetchAll = async () => {
    const res = await axios.get(`/api/departments?archived=${showArchived}`, { headers });
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/departments/${editing}`, form, { headers });
      } else {
        await axios.post("/api/departments", form, { headers });
      }
      setForm({ name: "", code: "" });
      setEditing(null);
      fetchAll();
    } catch (err) {
      console.error("Submit error:", err.response?.data || err.message);
      alert(
        err.response?.data?.errors
          ? JSON.stringify(err.response.data.errors)
          : "Something went wrong"
      );
    }
  };

  const handleEdit = (department) => {
    setEditing(department.id);
    setForm({ name: department.name, code: department.code });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    await axios.delete(`/api/departments/${id}`, { headers });
    fetchAll();
  };

  const handleArchive = async (id) => {
    await axios.put(`/api/departments/${id}/archive`, {}, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Departments</h2>

      <button
        onClick={() => setShowArchived(!showArchived)}
        className={`mb-4 px-4 py-2 rounded-md text-white ${
          showArchived ? "bg-gray-600" : "bg-green-600"
        }`}
      >
        {showArchived ? "Show Active" : "Show Archived"}
      </button>

      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input
          required
          className="border p-2 w-full"
          placeholder="Department Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          className="border p-2 w-full"
          placeholder="Department Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Department" : "Add Department"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.name}</td>
              <td className="border p-2">{d.code}</td>
              <td className="border p-2 space-x-2">
                {!showArchived ? (
                  <>
                    <button onClick={() => handleEdit(d)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleArchive(d.id)} className="text-yellow-600">
                      Archive
                    </button>
                    <button onClick={() => handleDelete(d.id)} className="text-red-600">
                      Delete
                    </button>
                  </>
                ) : (
                  <button onClick={() => handleArchive(d.id)} className="text-green-600">
                    Restore
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Departments;
