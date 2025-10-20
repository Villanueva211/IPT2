import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Reports() {
    const [activeTab, setActiveTab] = useState('students');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReport(activeTab);
    }, [activeTab]);

    const fetchReport = async (type) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/reports/${type}`);
            setReportData(res.data);
        } catch (error) {
            console.error('Error fetching report:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Reports</h2>

            {/* Tabs */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => setActiveTab('students')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'students'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200'
                    }`}
                >
                    Students Report
                </button>
                <button
                    onClick={() => setActiveTab('faculty')}
                    className={`px-4 py-2 rounded ${
                        activeTab === 'faculty'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200'
                    }`}
                >
                    Faculty Report
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow p-4">
                {loading ? (
                    <p>Loading {activeTab} data...</p>
                ) : (
                    <table className="min-w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Email</th>
                                <th className="border p-2">Department</th>
                                {activeTab === 'students' && (
                                    <th className="border p-2">Course</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="border p-2">{item.id}</td>
                                        <td className="border p-2">
                                            {item.first_name} {item.last_name}
                                        </td>
                                        <td className="border p-2">
                                            {item.email}
                                        </td>
                                        <td className="border p-2">
                                            {item.department?.name}
                                        </td>
                                        {activeTab === 'students' && (
                                            <td className="border p-2">
                                                {item.course?.name || item.course}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={activeTab === 'students' ? 5 : 4}
                                        className="text-center p-3 text-gray-500"
                                    >
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
