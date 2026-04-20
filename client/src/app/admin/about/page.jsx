"use client";
import { useState, useEffect } from "react";
import { FiLoader, FiTrash2, FiEdit3, FiImage, FiX, FiPlus, FiEdit } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({ description: "", image: null });

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      if (data && !data.error) {
        setAboutData(data);
        // Don't auto-fill the form yet unless the user clicks edit
      }
    } catch (error) {
      toast.error("Fetch error", error)
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (data) => {
    setEditId(data._id);
    setFormData({ description: data.description, image: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ description: "", image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append("description", formData.description);
    
    // Only append image if a new file was actually selected
    if (formData.image) {
      data.append("image", formData.image);
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/about/${editId}` : "/api/about";

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        toast.success(editId ? "Bio updated!" : "Bio created!")
        setEditId(null);
        setFormData({ description: "", image: null });
        fetchAbout();
      } else {
        const errorRes = await res.json();
        toast.error(`Failed: ${errorRes.error}`)

      }
    } catch (error) {
      toast.error("Error saving data")
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will remove your bio.")) return;
    try {
      const res = await fetch(`/api/about/${id}`, { method: "DELETE" });
      if (res.ok) {
        setAboutData(null);
        cancelEdit();
        fetchAbout();
        toast.success("Bio deleted Succesfully!")
      }
    } catch (error) {
      toast.error("Delete error", error)
    }
  };

  if (loading && !aboutData) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">About Settings</h1>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className={`p-6 border rounded-xl shadow-sm space-y-4 transition-all ${
          editId ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
        }`}
      >
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Professional Biography</label>
          <textarea
            className="w-full border p-3 rounded-lg h-40 outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 resize-none"
            placeholder="Introduce yourself..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Profile Photo</label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all border">
              <FiImage />
              {formData.image ? formData.image.name : "Choose New Image"}
              <input 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} 
              />
            </label>
            {editId && <span className="text-xs text-blue-600 font-medium italic">New upload will replace current image</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white transition-colors 
              ${editId ? 'bg-blue-600' : 'bg-purple-600'} 
              ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
          >
            {submitting ? <FiLoader className="animate-spin" /> : (editId ? <FiEdit /> : <FiPlus />)}
            {editId ? "Update Bio" : "Add Bio"}
          </button>

          {editId && (
            <button type="button" onClick={cancelEdit} className="flex items-center gap-1 text-gray-500 hover:text-red-500">
              <FiX /> Cancel
            </button>
          )}
        </div>
      </form>

      {aboutData && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              {aboutData.image && (
                <img src={aboutData.image} alt="Profile" className="w-20 h-20 rounded-lg object-cover bg-gray-100 border" />
              )}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live Content</span>
                <p className="text-gray-600 text-sm leading-relaxed pr-4">{aboutData.description}</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handleEditClick(aboutData)}
                className="p-2 text-blue-500 hover:bg-blue-50 rounded-md transition-colors border border-transparent hover:border-blue-100"
              >
                <FiEdit3 size={18} />
              </button>
              <button 
                onClick={() => handleDelete(aboutData._id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors border border-transparent hover:border-red-100"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}