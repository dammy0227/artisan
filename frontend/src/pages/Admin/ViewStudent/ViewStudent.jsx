import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudents, deleteStudent } from "../../../features/admin/adminThunks";
import { clearAdminMessages } from "../../../features/admin/adminSlice";
import {
  FaUserGraduate,
  FaSearch,
  FaFilter,
  FaTrash,
  FaEye,
  FaEdit,
  FaSort,
  FaUsers,
  FaUniversity,
  FaEnvelope,
  FaPhone,
  FaIdCard
} from "react-icons/fa";
import "./ViewStudent.css";

const ViewStudent = () => {
  const dispatch = useDispatch();
  const { students = [], loading, error, successMessage } = useSelector((state) => state.admin);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'

  // Fetch students
  useEffect(() => {
    dispatch(getAllStudents());
  }, [dispatch]);

  // Auto-clear messages with toast
  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      dispatch(clearAdminMessages());
    }
    if (error) {
      showToast(error, "error");
      dispatch(clearAdminMessages());
    }
  }, [successMessage, error, dispatch]);

  const showToast = (message, type) => {
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  // Get unique faculties for filter
  const faculties = ["all", ...new Set(students.map(s => s.faculty).filter(Boolean))];

  // Filter and sort students
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFaculty = selectedFaculty === "all" || student.faculty === selectedFaculty;
    
    return matchesSearch && matchesFaculty;
  }).sort((a, b) => {
    let aVal = a[sortBy] || "";
    let bVal = b[sortBy] || "";
    
    if (sortBy === "name") {
      aVal = a.name || "";
      bVal = b.name || "";
    }
    
    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    
    if (sortOrder === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  // Delete handler
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      dispatch(deleteStudent(id));
    }
  };

  // Stats calculation
  const stats = {
    total: students.length,
    byFaculty: faculties.reduce((acc, faculty) => {
      if (faculty !== "all") {
        acc[faculty] = students.filter(s => s.faculty === faculty).length;
      }
      return acc;
    }, {})
  };

  return (
    <div className="student-container">
      {/* Header */}
      <div className="student-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaUserGraduate /> Student Management
          </h1>
          <p className="page-subtitle">
            Manage and monitor all registered students
          </p>
        </div>
        <div className="header-stats">
          <div className="total-count">
            <FaUsers />
            <span>{stats.total} Students</span>
          </div>
        </div>
      </div>


      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <FaFilter /> Filters & Search
          </h3>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              Table
            </button>
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          {/* Search */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSearch /> Search Students
            </label>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Faculty Filter */}
          <div className="filter-group">
            <label className="filter-label">
              <FaUniversity /> Filter by Faculty
            </label>
            <select 
              className="filter-select"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              {faculties.map(faculty => (
                <option key={faculty} value={faculty}>
                  {faculty === "all" ? "All Faculties" : faculty}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="filter-group">
            <label className="filter-label">
              <FaSort /> Sort By
            </label>
            <div className="sort-controls">
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="faculty">Faculty</option>
                <option value="department">Department</option>
              </select>
              <button 
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                {sortOrder === "asc" ? "A-Z" : "Z-A"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students data...</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <FaUserGraduate size={48} />
          </div>
          <h3>No Students Found</h3>
          <p>No students match your search criteria. Try adjusting your filters.</p>
        </div>
      ) : viewMode === "table" ? (
        /* Table View */
        <div className="table-container">
          <div className="table-header-info">
            Showing {filteredStudents.length} of {students.length} students
            {selectedFaculty !== "all" && ` in ${selectedFaculty}`}
          </div>
          <table className="student-table">
            <thead>
              <tr>
                <th>Student Details</th>
                <th>Contact Info</th>
                <th>Academic Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student._id}>
                  <td>
                    <div className="student-info">
                      <div className="student-avatar">
                        {student.name?.charAt(0) || "S"}
                      </div>
                      <div className="student-details">
                        <div className="student-name">{student.name}</div>
                        <div className="student-id">
                          <FaIdCard /> ID: {student._id?.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-info">
                      <div className="contact-item">
                        <FaEnvelope /> {student.email}
                      </div>
                      <div className="contact-item">
                        <FaPhone /> {student.phone || "Not provided"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="academic-info">
                      <div className="academic-item">
                        <strong>Faculty:</strong> {student.faculty || "N/A"}
                      </div>
                      <div className="academic-item">
                        <strong>Department:</strong> {student.department || "N/A"}
                      </div>
                      <div className="academic-item">
                        <strong>Level:</strong> {student.level || "Not specified"}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn-small"
                        onClick={() => setSelectedStudent(student)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="edit-btn-small"
                        onClick={() => alert(`Edit ${student.name} - Feature coming soon`)}
                        title="Edit Student"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="delete-btn-small"
                        onClick={() => handleDelete(student._id, student.name)}
                        title="Delete Student"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="students-grid">
          {filteredStudents.map((student) => (
            <div key={student._id} className="student-card">
              <div className="card-header">
                <div className="student-avatar-large">
                  {student.name?.charAt(0) || "S"}
                </div>
                <div className="student-info-main">
                  <div className="student-name">{student.name}</div>
                  <div className="student-email">{student.email}</div>
                </div>
              </div>
              
              <div className="card-body">
                <div className="info-row">
                  <FaPhone /> <span>{student.phone || "Not provided"}</span>
                </div>
                <div className="info-row">
                  <FaUniversity /> <span>{student.faculty || "N/A"}</span>
                </div>
                <div className="info-row">
                  <FaIdCard /> <span>{student.department || "N/A"}</span>
                </div>
              </div>
              
              <div className="card-actions">
                <button
                  className="view-btn-full"
                  onClick={() => setSelectedStudent(student)}
                >
                  <FaEye /> View
                </button>
                <button
                  className="delete-btn-full"
                  onClick={() => handleDelete(student._id, student.name)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <div className="detail-header">
                  <div className="detail-avatar">
                    {selectedStudent.name?.charAt(0) || "S"}
                  </div>
                  <div className="detail-title">
                    <h4>{selectedStudent.name}</h4>
                    <p>Student ID: {selectedStudent._id}</p>
                  </div>
                </div>
                
                <div className="detail-grid">
                  <div className="detail-item">
                    <strong><FaEnvelope /> Email</strong>
                    <p>{selectedStudent.email}</p>
                  </div>
                  <div className="detail-item">
                    <strong><FaPhone /> Phone</strong>
                    <p>{selectedStudent.phone || "Not provided"}</p>
                  </div>
                  <div className="detail-item">
                    <strong><FaUniversity /> Faculty</strong>
                    <p>{selectedStudent.faculty || "N/A"}</p>
                  </div>
                  <div className="detail-item">
                    <strong>Department</strong>
                    <p>{selectedStudent.department || "N/A"}</p>
                  </div>
                  <div className="detail-item">
                    <strong>Level</strong>
                    <p>{selectedStudent.level || "Not specified"}</p>
                  </div>
                  <div className="detail-item">
                    <strong>Registration Date</strong>
                    <p>{selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : "Unknown"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="delete-btn-modal"
                onClick={() => {
                  handleDelete(selectedStudent._id, selectedStudent.name);
                  setSelectedStudent(null);
                }}
              >
                <FaTrash /> Delete Student
              </button>
              <button
                className="close-btn-modal"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudent;