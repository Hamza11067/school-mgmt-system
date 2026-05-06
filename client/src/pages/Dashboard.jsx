import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import AddStudentModal from "../components/AddStudentModal"; // Modal Import karein

const Dashboard = () => {
  const { token, logout } = useContext(AuthContext);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Student Directory</h1>
        <div className="flex space-x-4">
          {/* Naya Button */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            + Add Student
          </button>
          <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
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
                <td className="px-5 py-4 border-b text-sm">
                  <button className="text-red-600 hover:text-red-900 font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Component */}
      <AddStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onStudentAdded={fetchStudents} // Add hone ke baad list refresh hogi
      />
    </div>
  );
};

export default Dashboard;
