import { useState, useEffect } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});

  // 1. Fetch students on load
  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
      
      // Initialize everyone as 'Present' to save time
      const initialData = {};
      res.data.forEach(s => initialData[s.id] = { status: 'Present', remarks: '' });
      setAttendanceData(initialData);
    };
    fetchStudents();
  }, []);

  const handleStatusChange = (id, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [id]: { ...prev[id], status }
    }));
  };

  const handleSave = async () => {
    const records = Object.entries(attendanceData).map(([id, data]) => ({
      student_id: id,
      status: data.status,
      remarks: data.remarks
    }));

    try {
      await axios.post('http://localhost:5000/api/attendance', {
        attendance_date: date,
        records
      });
      alert("Attendance Saved!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Take Attendance</h1>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Clean container - hidden scrollbar via Tailwind if you have the plugin, 
            otherwise standard overflow-auto */}
        <div className="overflow-auto max-h-[60vh] scrollbar-hide">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="p-4 text-left">Student Name</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 flex justify-center gap-2">
                    {['Present', 'Absent', 'Late'].map(s => (
                      <button
                        key={s}
                        onClick={() => handleStatusChange(student.id, s)}
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition
                          ${attendanceData[student.id]?.status === s 
                            ? (s === 'Present' ? 'bg-green-500 text-white' : s === 'Absent' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white') 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      >
                        {s.charAt(0)}
                      </button>
                    ))}
                  </td>
                  <td className="p-4">
                    <input 
                      type="text"
                      placeholder="Optional note..."
                      className="text-sm border-b border-transparent focus:border-blue-500 outline-none w-full"
                      onChange={(e) => {
                        setAttendanceData(prev => ({
                          ...prev,
                          [student.id]: { ...prev[student.id], remarks: e.target.value }
                        }));
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          onClick={handleSave}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition"
        >
          Submit Attendance for {date}
        </button>
      </div>
    </div>
  );
};

export default Attendance;