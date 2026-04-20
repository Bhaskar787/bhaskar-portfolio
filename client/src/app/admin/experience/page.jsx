"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit, FiLoader, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Track if we are editing
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    duration: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch("/api/experience");
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Populate form for editing
  const handleEditClick = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      duration: exp.duration,
      description: exp.description,
      image: null, // Reset image input; only update if a new file is chosen
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", duration: "", description: "", image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("duration", formData.duration);
    data.append("description", formData.description);
    
    // Only append image if a new file was selected
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const url = editingId ? `/api/experience/${editingId}` : "/api/experience";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: data, 
      });

      if (res.ok) {
        fetchExperiences();
        cancelEdit();
        toast.success(editingId ? "Experience updated!" : "Experience added!")
      }
    } catch (error) {
      toast.error("Submission error:", error)
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (res.ok) fetchExperiences();
      toast.success("Experience deleted.")
    } catch (error) {
      toast.error("Delete error:", error)
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">
          {editingId ? "Edit Experience" : "Manage Experience"}
        </h1>
       
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className={`p-6 rounded-xl shadow-sm border transition-all ${editingId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'} space-y-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Full Stack Developer"
              className="w-full p-2 text-slate-800 border rounded outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-600">Duration</label>
            <input
              type="text"
              placeholder="e.g. 2023 - Present"
              className="w-full p-2 text-slate-800 border rounded outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">Description</label>
          <textarea
            placeholder="Describe your responsibilities..."
            rows="3"
            className="w-full text-slate-800 p-2 border rounded outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-gray-600">
            Company Logo {editingId && "(Leave empty to keep current)"}
          </label>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
          />
        </div>

<div className="flex items-center gap-4">
  {/* Main Action Button */}
  <button
    type="submit"
    disabled={submitting}
    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors 
      ${editingId ? 'bg-blue-600' : 'bg-purple-600'} 
      ${submitting ? 'opacity-50' : 'hover:opacity-90'}`}
  >
    {submitting ? <FiLoader className="animate-spin" /> : (editingId ? <FiEdit /> : <FiPlus />)}
    {editingId ? "Update Experience" : "Add Experience"}
  </button>

  {/* Cancel Button - Only shows when editing */}
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

      {/* List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Icon</th>
              <th className="p-4">Title & Details</th>
              <th className="p-4">Duration</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
               <tr><td colSpan="4" className="p-8 text-center text-gray-400 animate-pulse">Loading...</td></tr>
            ) : experiences.map((exp) => (
              <tr key={exp._id} className={`hover:bg-gray-50 transition-colors ${editingId === exp._id ? 'bg-blue-50' : ''}`}>
                <td className="p-4">
                  <div className="w-12 h-12 rounded border bg-gray-50 flex items-center justify-center overflow-hidden">
                    {exp.image ? (
                      <img src={exp.image} alt="logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-300 text-xs">No Logo</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-gray-800">{exp.title}</div>
                  <div className="text-xs text-gray-400 line-clamp-1">{exp.description}</div>
                </td>
                <td className="p-4 text-gray-500 text-sm font-medium">{exp.duration}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleEditClick(exp)} 
                      className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-full transition-all"
                      title="Edit"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(exp._id)} 
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-all"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}