import axios from "axios";
import { useNavigate } from "react-router-dom";

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "100px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    width: "90px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "120px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: true,
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const response = await axios.get(
      "https://hrms-backend-o2gb.onrender.com/api/department",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      departments = response.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

// employees for salary form
export const getEmployees = async (id) => {
  let employees;
  try {
    const response = await axios.get(
      `https://hrms-backend-o2gb.onrender.com/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      employees = response.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};

export const EmployeeButtons = ({ DepId }) => {
  const navigate = useNavigate();
  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;

    try {
      const response = await axios.delete(
        `https://hrms-backend-o2gb.onrender.com/api/employee/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Employee deleted successfully");
        // Optional: refresh list or navigate
        window.location.reload(); // or refetch your employee list
      }
    } catch (error) {
      alert(error.response?.data?.error || "Error deleting employee");
    }
  };

  return (
    <div className="flex space-x-3">
      <button
        className="px-3 py-1 bg-teal-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/${DepId}`)}
      >
        View
      </button>
      <button
        className="px-3 py-1 bg-blue-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${DepId}`)}
      >
        Edit
      </button>
      <button
        className="px-3 py-1 bg-yellow-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${DepId}/`)}
      >
        Salary
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${DepId}`)}
      >
        Leave
      </button>
      <button
        className="px-3 py-1 bg-red-700 text-white"
        onClick={() => handleDelete(DepId)} // This should be the employee._id, not department
      >
        Delete
      </button>
    </div>
  );
};
