import React, { useState, useEffect } from "react";
import axios from "axios";

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get("/api/departments", { headers });
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    if (editing) await axios.put(`/api/departments/${editing}`, form, { headers });
    else await axios.post("/api/departments", form, { headers });
    setForm({ name: "" });
    setEditing(null);
    fetchAll();
  };

  const handleEdit = (d) => {
    setForm({ name: d.name });
    setEditing(d.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`/api/departments/${id}`, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input required className="border p-2 w-full" placeholder="Department Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Department" : "Add Department"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td className="border p-2">{d.name}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(d)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(d.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Departments;
