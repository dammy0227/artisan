import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPreviousWork,
  getPreviousWorks,
  deletePreviousWork,
  updatePreviousWork,
} from "../../../features/artisan/artisanThunks";
import { clearArtisanMessages } from "../../../features/artisan/artisanSlice";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaImage,
  FaSave,
  FaTimes,
  FaUpload,
  FaStar,
  FaCalendarAlt,
  FaEye,
  FaFilter,
  FaSearch
} from "react-icons/fa";
import "./Post.css";

const Post = () => {
  const dispatch = useDispatch();
  const { previousWorks = [], loading, error, successMessage } =
    useSelector((state) => state.artisan);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingWorkId, setEditingWorkId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'

  useEffect(() => {
    dispatch(getPreviousWorks());
    return () => {
      dispatch(clearArtisanMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      dispatch(clearArtisanMessages());
    }
    if (error) {
      showToast(error, "error");
      dispatch(clearArtisanMessages());
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    dispatch(addPreviousWork(formData)).then(() => {
      setTitle("");
      setDescription("");
      setImage(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = "";
    });
  };

  const handleDelete = (workId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deletePreviousWork(workId));
    }
  };

  const startEdit = (work) => {
    setEditingWorkId(work._id);
    setEditTitle(work.title);
    setEditDescription(work.description);
    setEditImage(null);
  };

  const cancelEdit = () => {
    setEditingWorkId(null);
    setEditTitle("");
    setEditDescription("");
    setEditImage(null);
  };

  const handleUpdate = (workId) => {
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);
    if (editImage) formData.append("image", editImage);

    dispatch(updatePreviousWork({ workId, formData })).then(() => {
      cancelEdit();
    });
  };

  // Filter and sort works
  const filteredWorks = previousWorks?.filter(work => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      work.title?.toLowerCase().includes(searchLower) ||
      work.description?.toLowerCase().includes(searchLower)
    );
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    if (sortBy === "oldest") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    if (sortBy === "title") {
      return a.title?.localeCompare(b.title);
    }
    return 0;
  });

  const stats = {
    total: previousWorks?.length || 0,
    withImages: previousWorks?.filter(w => w.image).length || 0,
    recent: previousWorks?.filter(w => {
      const daysAgo = (Date.now() - new Date(w.createdAt)) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    }).length || 0,
  };

  return (
    <div className="artisan-posts">
      {/* Header */}
      <div className="posts-header">
        <div className="header-left">
          <h1 className="page-title">
            <FaImage /> My Portfolio
          </h1>
          <p className="page-subtitle">
            Showcase your previous work to attract more clients
          </p>
        </div>
        <div className="header-stats">
          <div className="total-works">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Works</span>
          </div>
        </div>
      </div>

   

      {/* Add New Work Form */}
      <motion.div 
        className="add-work-section"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="section-title">
          <FaPlus /> Add New Work
        </h3>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                placeholder="e.g., Modern Kitchen Renovation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                placeholder="Describe your work in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                required
                className="form-textarea"
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                <FaUpload /> Upload Image
              </label>
              <div className="file-upload">
                <input
                  type="file"
                  id="work-image"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="file-input"
                  accept="image/*"
                />
                <label htmlFor="work-image" className="file-label">
                  <FaImage /> Choose Image
                </label>
                {image && (
                  <span className="file-name">{image.name}</span>
                )}
              </div>
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus /> Add to Portfolio
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filters-header">
          <h3 className="filters-title">
            <FaFilter /> Portfolio ({filteredWorks?.length})
          </h3>
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid View
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              List View
            </button>
          </div>
        </div>
        
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">
              <FaSearch /> Search Works
            </label>
            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="clear-search"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <FaFilter /> Sort By
            </label>
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Works Display */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your portfolio...</p>
        </div>
      ) : filteredWorks?.length === 0 ? (
        <div className="empty-state">
          <FaImage size={48} />
          <h3>No Works Found</h3>
          <p>
            {searchTerm 
              ? `No works match "${searchTerm}"`
              : "Add your first work to start building your portfolio"}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="works-grid">
          <AnimatePresence>
            {filteredWorks?.map((work) => (
              <motion.div
                key={work._id}
                className={`work-card ${
                  editingWorkId === work._id ? "editing-card" : ""
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                layout
              >
                {editingWorkId === work._id ? (
                  // Edit Mode
                  <div className="edit-mode">
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                        placeholder="Title"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="edit-textarea"
                        placeholder="Description"
                        rows={3}
                      />
                      <div className="file-upload">
                        <input
                          type="file"
                          onChange={(e) => setEditImage(e.target.files[0])}
                          className="file-input"
                          accept="image/*"
                        />
                        <label className="file-label">
                          <FaUpload /> Change Image
                        </label>
                        {editImage && (
                          <span className="file-name">{editImage.name}</span>
                        )}
                      </div>
                      <div className="edit-actions">
                        <button
                          className="save-btn"
                          onClick={() => handleUpdate(work._id)}
                          disabled={loading}
                        >
                          <FaSave /> Save Changes
                        </button>
                        <button className="cancel-btn" onClick={cancelEdit}>
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="card-header">
                      <h3 className="work-title">{work.title}</h3>
                      <div className="work-meta">
                        {work.createdAt && (
                          <span className="work-date">
                            <FaCalendarAlt /> {new Date(work.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {work.image && (
                      <div 
                        className="work-image-container"
                        onClick={() => setSelectedImage(work.image)}
                      >
                        <img
                          src={work.image}
                          alt={work.title}
                          className="work-image"
                        />
                        <div className="image-overlay">
                          <FaEye /> Click to view
                        </div>
                      </div>
                    )}
                    
                    <div className="card-body">
                      <p className="work-description">{work.description}</p>
                    </div>
                    
                    <div className="card-footer">
                      <div className="work-actions">
                        <button
                          onClick={() => startEdit(work)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(work._id, work.title)}
                          className="action-btn delete-btn"
                          title="Delete"
                          disabled={loading}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        // List View
        <div className="works-list">
          <AnimatePresence>
            {filteredWorks?.map((work) => (
              <motion.div
                key={work._id}
                className="work-list-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="list-item-content">
                  {work.image && (
                    <img
                      src={work.image}
                      alt={work.title}
                      className="list-image"
                      onClick={() => setSelectedImage(work.image)}
                    />
                  )}
                  <div className="list-details">
                    <h4 className="list-title">{work.title}</h4>
                    <p className="list-description">{work.description}</p>
                    {work.createdAt && (
                      <span className="list-date">
                        <FaCalendarAlt /> {new Date(work.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="list-actions">
                  <button
                    onClick={() => startEdit(work)}
                    className="action-btn edit-btn"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(work._id, work.title)}
                    className="action-btn delete-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="image-preview-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={selectedImage} alt="preview" className="preview-image" />
              <button
                className="close-preview-btn"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Post;