import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

/* ---------- Inline SVG Icons (no external CSS) ---------- */
const IconUsers = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16 11c1.66 0 2.99-1.79 2.99-4S17.66 3 16 3s-3 1.79-3 4 1.34 4 3 4zm-8 0c1.66 0 3-1.79 3-4S9.66 3 8 3 5 4.79 5 7s1.34 4 3 4zm0 2c-2.67 0-8 1.34-8 4v2h10v-2c0-1.54.58-2.94 1.53-4.03C10.53 12.37 9.33 13 8 13zm8 0c-.29 0-.57.02-.85.05 1.02.84 1.85 1.95 2.35 3.29.33.9.5 1.86.5 2.83V21h6v-2c0-2.66-5.33-4-8-4z"/>
  </svg>
);
const IconBadge = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 3H5c-1.1 0-2 .9-2 2v12l4-2 4 2 4-2 4 2V5c0-1.1-.9-2-2-2zM7 8h10v2H7V8zm0 4h7v2H7v-2z"/>
  </svg>
);
const IconBuilding = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M3 21h18v-2H3v2zM19 3H5v14h14V3zM7 7h2v2H7V7zm0 4h2v2H7v-2zm4-4h2v2h-2V7zm0 4h2v2h-2v-2zm4-4h2v2h-2V7zm0 4h2v2h-2v-2z"/>
  </svg>
);
const IconBook = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18 2H9C7.9 2 7 2.9 7 4v16c0 1.1.9 2 2 2h9v-2H9V4h9v5l2-1.5V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ students: 0, faculties: 0, departments: 0, courses: 0 });
  const [courseStats, setCourseStats] = useState([]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/stats/counts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch stats: ${res.status}`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  const fetchCourseStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/stats/course-enrollment", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });
      if (!res.ok) throw new Error(`Failed to fetch course stats: ${res.status}`);
      const data = await res.json();
      setCourseStats(data || []);
    } catch (err) {
      console.error("Failed to load course stats:", err);
      setCourseStats([]);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCourseStats();
  }, []);

  const chartData = {
    labels: ["Students", "Faculties", "Departments", "Courses"],
    datasets: [
      {
        label: "Total Count",
        data: [stats.students, stats.faculties, stats.departments, stats.courses],
        backgroundColor: [
          "rgba(37, 99, 235, 0.7)",
          "rgba(22, 163, 74, 0.7)",
          "rgba(147, 51, 234, 0.7)",
          "rgba(234, 179, 8, 0.7)",
        ],
        borderColor: [
          "rgba(37, 99, 235, 1)",
          "rgba(22, 163, 74, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, precision: 0 } },
  };

  const pieData = {
    labels: courseStats.map((i) => i.course_name),
    datasets: [
      {
        label: "Students per Course",
        data: courseStats.map((i) => i.student_count),
        backgroundColor: [
          "rgba(54, 162, 235, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards with inline SVG icons */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg">Students</h2>
            <p className="text-3xl font-bold">{stats.students}</p>
          </div>
          <IconUsers className="w-14 h-14 opacity-70" />
        </div>

        <div className="bg-green-600 text-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg">Faculties</h2>
            <p className="text-3xl font-bold">{stats.faculties}</p>
          </div>
          <IconBadge className="w-14 h-14 opacity-70" />
        </div>

        <div className="bg-purple-600 text-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg">Departments</h2>
            <p className="text-3xl font-bold">{stats.departments}</p>
          </div>
          <IconBuilding className="w-14 h-14 opacity-70" />
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded shadow flex items-center justify-between">
          <div>
            <h2 className="text-lg">Courses</h2>
            <p className="text-3xl font-bold">{stats.courses}</p>
          </div>
          <IconBook className="w-14 h-14 opacity-70" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded shadow h-[300px]">
          <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded shadow h-[300px] flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-center">Students per Course</h2>
          <div className="h-64 w-64">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
