"use client";
import { useState, useEffect } from "react";
import { FiLoader, FiTrash2, FiEdit3, FiImage, FiX, FiPlus, FiCheckCircle } from "react-icons/fi";
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
      }
    } catch (error) {
      toast.error("Failed to fetch about data");
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
    
    if (formData.image) {
      data.append("image", formData.image);
    }

    const method = editId ? "PUT" : "POST";
    const url = editId ? `/api/about/${editId}` : "/api/about";

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        toast.success(editId ? "Bio Updated!" : "Bio Created!");
        setEditId(null);
        setFormData({ description: "", image: null });
        fetchAbout();
      } else {
        const errorRes = await res.json();
        toast.error(`Failed: ${errorRes.error}`);
      }
    } catch (error) {
      toast.error("Error saving data");
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
        toast.success("Bio Deleted!");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FiLoader className="w-16 h-16 text-slate-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-lg">Loading about data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
        <div>
          <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
            About Section
          </h1>
          <p className="text-xl text-slate-400">
            {aboutData ? "Update your professional bio" : "Introduce yourself to visitors"}
          </p>
        </div>
        {aboutData && (
          <div className="text-right">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-2xl border border-emerald-500/30">
              <FiCheckCircle className="w-4 h-4" />
              Live
            </span>
          </div>
        )}
      </div>

      {/* Edit/Add Form */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-200 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">
            {editId ? "Edit About Section" : "About Section"}
          </h2>
          {editId && (
            <button 
              onClick={cancelEdit}
              className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300"
            >
              <FiX className="w-4 h-4" />
              Cancel
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div>
            <label className="block text-slate-300 font-semibold mb-4 text-lg flex items-center gap-2">
              <FiImage className="w-6 h-6" />
              Profile Photo
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                className="w-full px-6 py-6 bg-slate-800/50 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-700/50 text-white file:mr-6 file:py-4 file:px-6 file:rounded-2xl file:border-0 file:font-semibold file:bg-gradient-to-r file:from-purple-600/20 file:to-indigo-600/20 file:text-purple-300 hover:file:bg-gradient-to-r hover:file:from-purple-600/30 hover:file:to-indigo-600/30 hover:file:text-purple-200 hover:border-purple-500/50 transition-all cursor-pointer text-lg shadow-inner hover:shadow-purple-500/25"
              />
              {editId && (
                <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                  <FiCheckCircle className="w-4 h-4 text-emerald-400" />
                  Current image will be kept unless new one uploaded
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-300 font-semibold mb-4 text-lg">
              Professional Biography
            </label>
            <textarea
              rows="8"
              placeholder="Tell your story... Introduce yourself, your passion for development, your journey, and what makes you unique. Visitors will read this first!"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-6 py-6 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-lg resize-vertical shadow-inner hover:border-slate-600/75 min-h-[200px]"
            />
            <p className="text-xs text-slate-500 mt-3">
              Tip: Keep it concise (150-300 words) and engaging. Use first-person voice.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting || !formData.description.trim()}
              className={`group relative flex items-center gap-3 px-12 py-5 font-bold text-xl rounded-3xl shadow-2xl transition-all duration-500 flex-1 min-w-[280px] ${
                submitting || !formData.description.trim()
                  ? 'bg-slate-700/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-500 text-white border border-purple-500/50 hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-[1.02] shadow-purple-500/25'
              }`}
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin w-6 h-6" />
                  <span>{editId ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  {editId ? <FiEdit3 className="w-6 h-6" /> : <FiPlus className="w-6 h-6" />}
                  <span>{editId ? "Update Bio" : "Create Bio"}</span>
                </>
              )}
              {!submitting && (
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              )}
            </button>

            {editId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="flex items-center gap-2 px-12 py-5 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 font-bold text-xl rounded-3xl transition-all duration-300 shadow-lg hover:shadow-slate-500/25 hover:-translate-y-0.5 min-w-[200px]"
              >
                <FiX className="w-6 h-6" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Preview */}
      {aboutData && (
        <div className="bg-slate-900/70 backdrop-blur-sm p-8 lg:p-12 rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-400">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FiCheckCircle className="w-8 h-8 text-emerald-400" />
              Live Preview
            </h2>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-2xl border border-emerald-500/30">
              Published
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            {/* Profile Image */}
            {aboutData.image ? (
              <div className="relative flex-shrink-0">
                <img 
                  src={aboutData.image} 
                  alt="Profile" 
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl object-cover shadow-2xl border-4 border-slate-800/50 ring-4 ring-slate-900/50"
                />
              </div>
            ) : (
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border-4 border-slate-700/50 shadow-2xl ring-4 ring-slate-900/50">
                <FiImage className="w-16 h-16 text-slate-500" />
              </div>
            )}

            {/* Bio Text */}
            <div className="flex-1 space-y-4 min-w-0">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/50 backdrop-blur-sm rounded-3xl border border-slate-700/50">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Live on Portfolio</span>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-200 line-clamp-6 lg:line-clamp-none">
                  {aboutData.description}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-8 mt-8 border-t border-slate-800/50">
            <button 
              onClick={() => handleEditClick(aboutData)}
              className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 font-bold"
            >
              <FiEdit3 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Update Bio
            </button>
            <button 
              onClick={() => handleDelete(aboutData._id)}
              className="group flex items-center gap-3 px-8 py-4 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:text-red-200 hover:border-red-500/50 rounded-3xl transition-all duration-300 shadow-lg hover:shadow-red-500/25 hover:scale-105 font-bold"
            >
              <FiTrash2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              Delete Bio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}