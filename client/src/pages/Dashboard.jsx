import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import StudentModal from "../components/StudentModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Backend se data lane ka function
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students/all", {
        headers: { token: token }, // Token bhenjna lazmi hai
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err.message);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/delete/${id}`, {
          headers: { token: token },
        });
        alert("Student deleted successfully!");
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err.response || err);
        const errorMessage = err.response?.data?.message || err.message;
        alert("Error deleting student: " + errorMessage);
      }
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/attendance")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 hover:bg-blue-700"
          >
            Take Attendance
          </button>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            + Add Student
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr className="bg-blue-600 text-white text-left text-sm uppercase font-semibold">
              <th className="px-5 py-3 border-b-2">Name</th>
              <th className="px-5 py-3 border-b-2">Roll Number</th>
              <th className="px-5 py-3 border-b-2">Class</th>
              <th className="px-5 py-3 border-b-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-5 py-4 border-b text-sm">{student.name}</td>
                <td className="px-5 py-4 border-b text-sm">
                  {student.roll_number}
                </td>
                <td className="px-5 py-4 border-b text-sm">
                  {student.class_name}
                </td>
                <td className="px-5 py-4 border-b text-sm space-x-3">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-900 font-bold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    className="text-red-600 hover:text-red-900 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStudentSaved={fetchStudents}
        student={selectedStudent}
      />
    </div>
  );
};

export default Dashboard;
