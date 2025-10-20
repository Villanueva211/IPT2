import React, { useState, useEffect } from "react";
import axios from "axios";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    position: "",
    department_id: "",
    status: "active",
  });
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const [f, d] = await Promise.all([
      axios.get("/api/faculties", { headers }),
      axios.get("/api/departments", { headers }),
    ]);
    setFaculties(f.data);
    setDepartments(d.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    if (editing) await axios.put(`/api/faculties/${editing}`, form, { headers });
    else await axios.post("/api/faculties", form, { headers });
    setForm({ name: "", position: "", department_id: "", status: "active" });
    setEditing(null);
    fetchAll();
  };

  const handleEdit = (f) => {
    setForm({
      name: f.name,
      position: f.position,
      department_id: f.department_id,
      status: f.status,
    });
    setEditing(f.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`/api/faculties/${id}`, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Faculty</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input required className="border p-2 w-full" placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="border p-2 w-full" placeholder="Position"
          value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        <select required className="border p-2 w-full" value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}>
          <option value="">Select Department</option>
          {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
        </select>
        <select required className="border p-2 w-full" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Faculty" : "Add Faculty"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {faculties.map((f) => (
            <tr key={f.id}>
              <td className="border p-2">{f.name}</td>
              <td className="border p-2">{f.position}</td>
              <td className="border p-2">{f.department?.name}</td>
              <td className="border p-2">{f.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(f)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(f.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Faculty;
