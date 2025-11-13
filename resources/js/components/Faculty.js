import React, { useState, useEffect } from "react";
import axios from "axios";

function Faculty() {
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    department_id: "",
    status: "active",
  });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived]);

  const fetchAll = async () => {
    const [f, d] = await Promise.all([
      axios.get(`/api/faculties?archived=${showArchived}`, { headers }),
      axios.get("/api/departments", { headers }),
    ]);
    setFaculties(f.data);
    setDepartments(d.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email || null,
      position: form.position,
      department_id: form.department_id,
      status: form.status,
    };
    if (editing) {
      await axios.put(`/api/faculties/${editing}`, payload, { headers });
    } else {
      await axios.post("/api/faculties", payload, { headers });
    }
    setForm({ name: "", email: "", position: "", department_id: "", status: "active" });
    setEditing(null);
    setShowForm(false);
    fetchAll();
  };

  const handleEdit = (f) => {
    setForm({
      name: f.name || "",
      email: f.email || "",
      position: f.position || "",
      department_id: f.department_id || "",
      status: f.status || "active",
    });
    setEditing(f.id);
    setShowForm(true);
  };

  const handleArchive = async (id) => {
    await axios.put(`/api/faculties/${id}/archive`, {}, { headers });
    fetchAll();
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete faculty "${name}" permanently?`)) return;
    await axios.delete(`/api/faculties/${id}`, { headers });
    setFaculties((list) => list.filter((x) => x.id !== id));
    if (editing === id) {
      setForm({ name: "", email: "", position: "", department_id: "", status: "active" });
      setEditing(null);
      setShowForm(false);
    }
  };

  const filteredFaculties = faculties.filter((f) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q || f.name?.toLowerCase().includes(q) || f.email?.toLowerCase().includes(q);
    const matchesDept = filterDept ? String(f.department_id) === String(filterDept) : true;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Faculty</h2>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          type="text"
          placeholder="Search name or email…"
          className="border p-2 rounded-md flex-1 min-w-[220px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded-md"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditing(null);
            setForm({ name: "", email: "", position: "", department_id: "", status: "active" });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {showForm ? "Close Form" : "Add Faculty"}
        </button>

        <button
          onClick={() => setShowArchived(!showArchived)}
          className={`px-4 py-2 rounded-md text-white ${
            showArchived ? "bg-gray-600" : "bg-green-600"
          }`}
        >
          {showArchived ? "Show Active" : "Show Archived"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-50 p-4 rounded-md border">
          <h3 className="text-lg font-semibold mb-2">
            {editing ? "Edit Faculty" : "Add Faculty"}
          </h3>

          <input
            required
            className="border p-2 rounded-md w-full"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            className="border p-2 rounded-md w-full"
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            required
            className="border p-2 rounded-md w-full"
            placeholder="Position"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />

          <select
            required
            className="border p-2 rounded-md w-full"
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

          <select
            required
            className="border p-2 rounded-md w-full"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex justify-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">
              {editing ? "Update Faculty" : "Add Faculty"}
            </button>
          </div>
        </form>
      )}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Position</th>
            <th className="border p-2">Department</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFaculties.length > 0 ? (
            filteredFaculties.map((f) => (
              <tr key={f.id}>
                <td className="border p-2">{f.name}</td>
                <td className="border p-2">{f.email || "-"}</td>
                <td className="border p-2">{f.position}</td>
                <td className="border p-2">{f.department?.name}</td>
                <td className="border p-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                      f.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {f.status}
                  </span>
                </td>
                <td className="border p-2 space-x-3 text-center">
                  {!showArchived ? (
                    <>
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleArchive(f.id)}
                        className="text-amber-600 hover:underline"
                      >
                        Archive
                      </button>
                      <button
                        onClick={() => handleDelete(f.id, f.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleArchive(f.id)}
                        className="text-green-600 hover:underline mr-3"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => handleDelete(f.id, f.name)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4 text-gray-500">
                No faculty found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Faculty;
