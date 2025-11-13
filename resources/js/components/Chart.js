// resources/js/components/Chart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function CoursePieChart({ courseData }) {
  // Example data (you can replace this with your backend data later)
  const data = {
    labels: courseData ? courseData.labels : ['BSIT', 'BSCS', 'BSIS'],
    datasets: [
      {
        label: 'Students Enrolled',
        data: courseData ? courseData.values : [10, 7, 5],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',  // Blue
          'rgba(75, 192, 192, 0.7)',  // Green
          'rgba(255, 206, 86, 0.7)',  // Yellow
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-md mt-6 w-[400px]">
      <h2 className="text-lg font-semibold mb-2 text-center">
        Student Enrollment by Course
      </h2>
      <Pie data={data} />
    </div>
  );
}

export default CoursePieChart;
