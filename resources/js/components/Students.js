import React, { useState, useEffect } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department_id: "",
    course_id: "",
    status: "active",
  });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const headers = { Authorization: `Bearer ${token}` };
    const [s, d, c] = await Promise.all([
      axios.get("/api/students", { headers }),
      axios.get("/api/departments", { headers }),
      axios.get("/api/courses", { headers }),
    ]);
    setStudents(s.data);
    setDepartments(d.data);
    setCourses(c.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headers = { Authorization: `Bearer ${token}` };
    if (editing) {
      await axios.put(`/api/students/${editing}`, form, { headers });
    } else {
      await axios.post("/api/students", form, { headers });
    }
    setForm({ name: "", email: "", department_id: "", course_id: "", status: "active" });
    setEditing(null);
    fetchAll();
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      department_id: student.department_id,
      course_id: student.course_id,
      status: student.status,
    });
    setEditing(student.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    const headers = { Authorization: `Bearer ${token}` };
    await axios.delete(`/api/students/${id}`, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <form onSubmit={handleSubmit} className="space-y-2 mb-4">
        <input required className="border p-2 w-full" placeholder="Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required className="border p-2 w-full" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <select required className="border p-2 w-full" value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}>
          <option value="">Select Department</option>
          {departments.map((d) => (<option key={d.id} value={d.id}>{d.name}</option>))}
        </select>
        <select required className="border p-2 w-full" value={form.course_id}
          onChange={(e) => setForm({ ...form, course_id: e.target.value })}>
          <option value="">Select Course</option>
          {courses.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <select required className="border p-2 w-full" value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Student" : "Add Student"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.department?.name}</td>
              <td className="border p-2">{s.course?.name}</td>
              <td className="border p-2">{s.status}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(s)} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(s.id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
