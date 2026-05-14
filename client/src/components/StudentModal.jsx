import { useState, useEffect } from 'react';
import axios from 'axios';

const StudentModal = ({ isOpen, onClose, onStudentSaved, student = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    roll_number: '',
    class_id: ''
  });
  const [classes, setClasses] = useState([]);

  // Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        roll_number: student.roll_number,
        class_id: student.class_id
      });
    } else {
      setFormData({
        name: '',
        roll_number: '',
        class_id: ''
      });
    }
  }, [isOpen, student]);

  // Dropdown ke liye classes fetch karna
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/classes/all', {
          headers: { token: localStorage.getItem('token') }
        });
        setClasses(res.data);
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    if (isOpen) fetchClasses();
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (student) {
        // Edit mode
        await axios.put(`http://localhost:5000/api/students/update/${student.id}`, formData, {
          headers: { token }
        });
        alert("Student Updated Successfully!");
      } else {
        // Add mode
        await axios.post('http://localhost:5000/api/students/add', formData, {
          headers: { token }
        });
        alert("Student Added Successfully!");
      }
      onStudentSaved(); // Table refresh karne ke liye
      onClose(); // Modal band karne ke liye
    } catch (err) {
      console.error("Error saving student:", err.response || err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      alert("Error saving student: " + errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {student ? "Edit Student" : "Add New Student"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input 
              type="text" 
              className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Roll Number</label>
            <input 
              type="text" 
              className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.roll_number}
              onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Class</label>
            <select 
              className="mt-1 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.class_id}
              onChange={(e) => setFormData({...formData, class_id: e.target.value})}
              required
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls.id} value={cls.id}>{cls.class_name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {student ? "Update Student" : "Save Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;