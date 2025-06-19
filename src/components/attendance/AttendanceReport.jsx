import React, { useEffect, useState } from "react";
import axios from "axios";

const AttendanceReport = () => {
  const [report, setReport] = useState({});
  const [limit, setLimit] = useState();
  const [skip, setSkip] = useState(0);
  const [dateFilter, setDateFilter] = useState();
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ limit, skip });
      if (dateFilter) {
        query.append("date", dateFilter);
      }
      const response = await axios.get(
        `https://hrms-backend-o2gb.onrender.com/api/attendance/report?${query.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);

      if (response.data.success) {
        if (skip == 0) {
          setReport(response.data.groupData);
        } else {
          setReport((prevData) => ({
            ...prevData,
            ...response.data.groupData,
          }));
        }
      }
      setLoading(false);
    } catch (error) {
      alert(error.message);
    }
  };
  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter]);

  return (
    <div className="min-h-screen p-10 bg-white">
      <h2 className="text-center text-2xl font-bold">Attendance Report</h2>
      <div>
        <h2 className="text-xl font-semibold">Filter by Date</h2>
        <input
          type="date"
          className="border bg-gray-100"
          value={dateFilter || ""}
          onChange={(e) => setDateFilter(e.target.value)}
        />
      </div>
      {loading ? (
        <div> Loading...</div>
      ) : (
        Object.entries(report).map(([date, record]) => (
          <div className="mt-4" key={date}>
            <h2 className="text-xl font-semibold mb-2">{date}</h2>
            <table className="w-full table-auto border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    S No
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Employee ID
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Name
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Department
                  </th>
                  <th className="border border-gray-300 px-6 py-3 text-left">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {record.map((data, i) => (
                  <tr key={data.employeeId} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-6 py-2">
                      {i + 1}
                    </td>
                    <td className="border border-gray-300 px-6 py-2">
                      {data.employeeId}
                    </td>
                    <td className="border border-gray-300 px-6 py-2">
                      {data.employeeName}
                    </td>
                    <td className="border border-gray-300 px-6 py-2">
                      {data.departmentName}
                    </td>
                    <td className="border border-gray-300 px-6 py-2">
                      {data.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default AttendanceReport;
