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

  useEffect(() => {
    dispatch(getPreviousWorks());
    return () => {
      dispatch(clearArtisanMessages());
    };
  }, [dispatch]);

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
      dispatch(getPreviousWorks());
    });
  };

  const handleDelete = (workId) => {
    if (window.confirm("Are you sure you want to delete this work?")) {
      dispatch(deletePreviousWork(workId)).then(() => {
        dispatch(getPreviousWorks());
      });
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
      dispatch(getPreviousWorks());
    });
  };

  return (
    <div className="artisan-posts">
      <h2 className="title">My Previous Works</h2>

      {successMessage && <p className="success">{successMessage}</p>}
      {error && <p className="error">{error}</p>}
      {loading && <p>Loading previous works...</p>}

 
      <motion.form
        onSubmit={handleSubmit}
        className="post-form"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Add Work"}
        </button>
      </motion.form>

     
      <div className="works-list">
        {!loading && previousWorks?.length === 0 && (
          <p>No previous works yet.</p>
        )}

        <AnimatePresence>
          {previousWorks?.map((work) => (
            <motion.div
              key={work._id}
              className={`work-card ${
                editingWorkId === work._id ? "editing-card" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {editingWorkId === work._id ? (
                // Edit Form
                <div className="work-info">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <input
                    type="file"
                    onChange={(e) => setEditImage(e.target.files[0])}
                  />

                  {/* ✅ Styled buttons */}
                  <div className="edit-actions">
                    <button
                      className="save-btn"
                      onClick={() => handleUpdate(work._id)}
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Normal view
                <div className="work-info">
                  <h3>{work.title}</h3>
                  {work.image && (
                    <img
                      src={work.image}
                      alt={work.title}
                      className="work-image"
                      onClick={() => setSelectedImage(work.image)}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  <p>{work.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button
                      onClick={() => startEdit(work)}
                      className="artisan-btn green-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(work._id)}
                      className="artisan-btn"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="image-preview-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="image-preview-container"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img src={selectedImage} alt="preview" />
              <button
                className="close-btn"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Post;
