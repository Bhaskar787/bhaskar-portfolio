"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiLoader, FiBookOpen, FiEdit, FiX } from "react-icons/fi";

export default function AdminEducation() {
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    duration: "",
    description: "",
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch("/api/education");
      const data = await res.json();
      setEducation(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (edu) => {
    setEditingId(edu._id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
      description: edu.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ institution: "", degree: "", duration: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingId ? `/api/education/${editingId}` : "/api/education";
      const method = editingId ? "PUT" : "POST";

      //  Using FormData to match  backend 
      const data = new FormData();
      data.append("institution", formData.institution);
      data.append("degree", formData.degree);
      data.append("duration", formData.duration);
      data.append("description", formData.description);
      // If we add an image input later, we'd append it here:
      // if (selectedFile) data.append("image", selectedFile);

      const res = await fetch(url, {
        method: method,
        
        body: data, 
      });
      
      if (res.ok) {
        fetchEducation();
        cancelEdit();
        alert(editingId ? "Record updated successfully!" : "Education record added!");
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Submission failed"}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
      if (res.ok) fetchEducation();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiBookOpen className="text-purple-600" /> 
          {editingId ? "Edit Education Record" : "Education Management"}
        </h1>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`p-6 rounded-xl shadow-sm border transition-all duration-300 ${
          editingId ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-200'
        } space-y-4`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Institution</label>
            <input
              type="text"
              className="w-full p-2 text-slate-800 border rounded outline-none focus:border-purple-500"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Degree</label>
            <input
              type="text"
              className="w-full p-2 text-slate-800 border rounded outline-none focus:border-purple-500"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Duration</label>
            <input
              type="text"
              className="w-full p-2 text-slate-800 border rounded outline-none focus:border-purple-500"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
          <textarea
            rows="3"
            className="w-full p-2 text-slate-800 border rounded outline-none focus:border-purple-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors 
              ${editingId ? 'bg-blue-600' : 'bg-purple-600'} 
              ${submitting ? 'opacity-50' : 'hover:opacity-90'}`}
          >
            {submitting ? <FiLoader className="animate-spin" /> : (editingId ? <FiEdit /> : <FiPlus />)}
            {editingId ? "Update Education" : "Add Education"}
          </button>

          {editingId && (
            <button 
              type="button" 
              onClick={cancelEdit} 
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Institution & Degree</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider">Duration</th>
              <th className="p-4 text-xs font-bold text-gray-600 uppercase tracking-wider text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-400 animate-pulse font-medium">Loading...</td></tr>
            ) : education.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-gray-400 font-medium">No records found.</td></tr>
            ) : (
              education.map((edu) => (
                <tr key={edu._id} className={`hover:bg-gray-50 transition-colors ${editingId === edu._id ? 'bg-purple-50' : ''}`}>
                  <td className="p-4">
                    <p className="font-bold text-gray-800 text-lg">{edu.degree}</p>
                    <p className="text-sm font-semibold text-purple-600">{edu.institution}</p>
                  </td>
                  <td className="p-4 text-gray-500 font-medium">{edu.duration}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEditClick(edu)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-full transition-all">
                        <FiEdit size={18} />
                      </button>
                      <button onClick={() => handleDelete(edu._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-all">
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}