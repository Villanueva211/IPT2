import React, { useState, useEffect } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => { fetchAll(); }, []);
  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const res = await axios.get("/api/courses", { headers });
    setCourses(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    if (editing) await axios.put(`/api/courses/${editing}`, form, { headers });
    else await axios.post("/api/courses", form, { headers });
    setForm({ name: "", code: "" });
    setEditing(null);
    fetchAll();
  };

  const handleEdit = (c) => {
    setForm({ name: c.name, code: c.code });
    setEditing(c.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`/api/courses/${id}`, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input required className="border p-2 w-full" placeholder="Course Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="border p-2 w-full" placeholder="Course Code"
          value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Course" : "Add Course"}
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
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(c)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Courses;
