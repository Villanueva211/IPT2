import React, { useState, useEffect } from "react";
import axios from "axios";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]); // 🆕 department list
  const [form, setForm] = useState({ name: "", code: "", department_id: "" });
  const [editing, setEditing] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const token = localStorage.getItem("token");

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    fetchDepartments();
  }, [showArchived]);

  const fetchAll = async () => {
    const res = await axios.get(`/api/courses?archived=${showArchived}`, { headers });
    setCourses(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get(`/api/departments?archived=false`, { headers });
    setDepartments(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/api/courses/${editing}`, form, { headers });
      } else {
        await axios.post("/api/courses", form, { headers });
      }
      setForm({ name: "", code: "", department_id: "" });
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

  const handleEdit = (course) => {
    setEditing(course.id);
    setForm({
      name: course.name,
      code: course.code,
      department_id: course.department_id,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    await axios.delete(`/api/courses/${id}`, { headers });
    fetchAll();
  };

  const handleArchive = async (id) => {
    await axios.put(`/api/courses/${id}/archive`, {}, { headers });
    fetchAll();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Courses</h2>

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
          placeholder="Course Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          className="border p-2 w-full"
          placeholder="Course Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />
        <select
          required
          className="border p-2 w-full"
          value={form.department_id}
          onChange={(e) => setForm({ ...form, department_id: e.target.value })}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          {editing ? "Update Course" : "Add Course"}
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.code}</td>
              <td className="border p-2">{c.department?.name}</td>
              <td className="border p-2 space-x-2">
                {!showArchived ? (
                  <>
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleArchive(c.id)}
                      className="text-yellow-600"
                    >
                      Archive
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleArchive(c.id)}
                    className="text-green-600"
                  >
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

export default Courses;
