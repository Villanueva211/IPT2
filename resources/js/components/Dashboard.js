import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    faculties: 0,
    departments: 0,
    courses: 0,
    academic_years: 0,
  });

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

      if (!res.ok) {
        throw new Error(`Failed to fetch stats: ${res.status}`);
      }

      const data = await res.json();
      console.log("Stats received:", data); // debug
      setStats(data);
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = {
    labels: ["Students", "Faculties", "Departments", "Courses", "Academic Years"],
    datasets: [
      {
        label: "Total Count",
        data: [
          stats.students,
          stats.faculties,
          stats.departments,
          stats.courses,
          stats.academic_years,
        ],
        backgroundColor: [
          "rgba(37, 99, 235, 0.7)",   // blue
          "rgba(22, 163, 74, 0.7)",   // green
          "rgba(147, 51, 234, 0.7)",  // purple
          "rgba(234, 179, 8, 0.7)",   // yellow
          "rgba(219, 39, 119, 0.7)",  // pink
        ],
        borderColor: [
          "rgba(37, 99, 235, 1)",
          "rgba(22, 163, 74, 1)",
          "rgba(147, 51, 234, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(219, 39, 119, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
      },
    },
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-4 rounded shadow">
          <h2 className="text-lg">Students</h2>
          <p className="text-3xl font-bold">{stats.students}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded shadow">
          <h2 className="text-lg">Faculties</h2>
          <p className="text-3xl font-bold">{stats.faculties}</p>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded shadow">
          <h2 className="text-lg">Departments</h2>
          <p className="text-3xl font-bold">{stats.departments}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded shadow">
          <h2 className="text-lg">Courses</h2>
          <p className="text-3xl font-bold">{stats.courses}</p>
        </div>
        <div className="bg-pink-600 text-white p-4 rounded shadow">
          <h2 className="text-lg">Academic Years</h2>
          <p className="text-3xl font-bold">{stats.academic_years}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
