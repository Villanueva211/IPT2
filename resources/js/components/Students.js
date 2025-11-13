import React, { useState, useEffect } from "react";
import axios from "axios";

function Students() {
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewArchived, setViewArchived] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    department_id: "",
    course_id: "",
    academic_year_id: "",
  });

  const [editing, setEditing] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [s, d, c, ay] = await Promise.all([
        axios.get("/api/students", { headers }),
        axios.get("/api/departments", { headers }),
        axios.get("/api/courses", { headers }),
        axios.get("/api/academic-years", { headers }),
      ]);
      setStudents(s.data);
      setDepartments(d.data);
      setCourses(c.data);
      setAcademicYears(ay.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (editing)
        await axios.put(`/api/students/${editing}`, form, { headers });
      else
        await axios.post("/api/students", { ...form, status: "active" }, { headers });

      resetForm();
      fetchAll();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student. Check console for details.");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      department_id: "",
      course_id: "",
      academic_year_id: "",
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      department_id: student.department_id,
      course_id: student.course_id,
      academic_year_id: student.academic_year_id,
    });
    setEditing(student.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`/api/students/${id}`, { headers });
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  // Archive student
  const handleArchive = async (student) => {
    if (!confirm(`Are you sure you want to archive ${student.name}?`)) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`/api/students/${student.id}`, { ...student, status: "archived" }, { headers });
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: "archived" } : s)));
    } catch (error) {
      console.error("Error archiving student:", error);
      alert("Archiving failed. Check console for details.");
    }
  };

  // Restore student
  const handleRestore = async (student) => {
    if (!confirm(`Restore ${student.name} to active list?`)) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.put(`/api/students/${student.id}`, { ...student, status: "active" }, { headers });
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: "active" } : s)));
    } catch (error) {
      console.error("Error restoring student:", error);
      alert("Restoring failed. Check console for details.");
    }
  };

  // Filters
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept ? s.department_id == filterDept : true;
    const matchesCourse = filterCourse ? s.course_id == filterCourse : true;
    const matchesYear = filterYear ? s.academic_year_id == filterYear : true;
    const matchesArchived = viewArchived ? s.status === "archived" : s.status === "active";
    return matchesSearch && matchesDept && matchesCourse && matchesYear && matchesArchived;
  });

  const archivedCount = students.filter((s) => s.status === "archived").length;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{viewArchived ? "Archived Students" : "Active Students"}</h2>

        <div className="space-x-2">
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (!showForm) setEditing(null);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {showForm ? "Close Form" : "Add Student"}
          </button>

          <button
            onClick={() => setViewArchived(!viewArchived)}
            className="bg-gray-600 text-white px-4 py-2 rounded relative"
          >
            {viewArchived ? "View Active" : `View Archived (${archivedCount})`}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border p-2 flex-1 min-w-[200px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="border p-2" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
          <option value="">All Departments</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select className="border p-2" value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select className="border p-2" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="">All Academic Years</option>
          {academicYears.map((ay) => (
            <option key={ay.id} value={ay.id}>
              {ay.year}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-2 mb-6 bg-gray-50 p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-2">{editing ? "Edit Student" : "Add Student"}</h3>

          <input
            required
            className="border p-2 w-full"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            type="email"
            className="border p-2 w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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

          <select
            required
            className="border p-2 w-full"
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            required
            className="border p-2 w-full"
            value={form.academic_year_id}
            onChange={(e) => setForm({ ...form, academic_year_id: e.target.value })}
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id}>
                {ay.year}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editing ? "Update Student" : "Add Student"}
            </button>
            <button type="button" onClick={resetForm} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Department</th>
            <th className="p-2 border">Course</th>
            <th className="p-2 border">Academic Year</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((s) => (
            <tr key={s.id}>
              <td className="border p-2">{s.name}</td>
              <td className="border p-2">{s.email}</td>
              <td className="border p-2">{s.department?.name}</td>
              <td className="border p-2">{s.course?.name}</td>
              <td className="border p-2">{s.academic_year ? s.academic_year.year : "N/A"}</td>
              <td className="border p-2 text-center">
                <span
                  className={`font-semibold px-2 py-1 rounded ${
                    s.status === "active" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                  }`}
                >
                  {s.status === "active" ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="border p-2 text-center space-x-2">
                {!viewArchived ? (
                  <>
                    <button onClick={() => handleEdit(s)} className="text-blue-600">
                      Edit
                    </button>
                    <button onClick={() => handleArchive(s)} className="text-yellow-600">
                      Archive
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600">
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleRestore(s)} className="text-green-600 mr-3">
                      Restore
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="text-red-600">
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
