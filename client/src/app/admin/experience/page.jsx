"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit, FiLoader, FiX, FiAward } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminExperience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
      toast.error("Failed to fetch experiences");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (exp) => {
    setEditingId(exp._id);
    setFormData({
      title: exp.title,
      duration: exp.duration,
      description: exp.description,
      image: null,
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
        toast.success(editingId ? "Experience Updated!" : "Experience Added!");
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this experience permanently?")) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchExperiences();
        toast.success("Experience Deleted!");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <FiLoader className="w-16 h-16 text-slate-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-lg">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2 leading-tight">
            Experience Management
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">Manage your professional journey timeline</p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-bold text-white">{experiences.length}</span>
          <p className="text-sm text-slate-400">Total Experiences</p>
        </div>
      </div>

      {/* Add/Edit Form - MOBILE RESPONSIVE */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {editingId ? "Edit Experience" : "Add New Experience"}
          </h2>
          {editingId && (
            <button 
              onClick={cancelEdit}
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-white px-4 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 w-full sm:w-auto min-h-[40px]"
            >
              <FiX className="w-4 h-4" />
              <span className="text-sm sm:text-base">Cancel</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Job Title / Position
              </label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer at Company XYZ"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. Jan 2023 - Present"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Description / Responsibilities
              </label>
              <textarea
                rows="4"
                placeholder="Describe your role, achievements, and responsibilities..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-emerald-500/75 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-300 text-base sm:text-lg resize-vertical shadow-inner hover:border-slate-600/75 min-h-[120px] sm:min-h-[140px]"
              />
            </div>

            {/* Company Logo */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Company Logo {editingId && "(Optional - keeps current if unchanged)"}
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white file:mr-4 file:py-2 sm:file:py-3 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-emerald-600/20 file:text-emerald-300 hover:file:bg-emerald-600/30 hover:file:text-emerald-200 transition-all cursor-pointer text-base sm:text-lg shadow-inner hover:border-emerald-500/50 min-h-[44px]"
                />
                <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                  <FiAward className="w-3 h-3 sm:w-4 sm:h-4" />
                  Recommended: 100x100px square
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - MOBILE STACKED */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={submitting || !formData.title.trim()}
              className={`group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-500 flex-1 min-h-[44px] sm:min-w-[220px] ${
                submitting || !formData.title.trim()
                  ? 'bg-slate-700/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:via-teal-500 hover:to-emerald-600 text-white border border-emerald-500/50 hover:shadow-emerald-500/50 hover:-translate-y-1 hover:scale-[1.02] shadow-emerald-500/25'
              }`}
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{editingId ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  {editingId ? <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  <span className="text-sm sm:text-base">{editingId ? "Update Experience" : "Add Experience"}</span>
                </>
              )}
              {!submitting && (
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl sm:rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              )}
            </button>

            {editingId && (
              <button 
                type="button" 
                onClick={cancelEdit}
                className="flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/25 hover:-translate-y-0.5 flex-1 sm:flex-none min-h-[44px]"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Cancel Edit</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Experiences Grid */}
      <div className="space-y-6 animate-slide-in-up delay-400">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
            <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
            Professional Journey ({experiences.length})
          </h2>
        </div>
        
        {experiences.length === 0 ? (
          <div className="grid place-items-center py-16 sm:py-20 bg-slate-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 text-center">
            <FiAward className="w-16 h-16 sm:w-20 sm:h-20 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg sm:text-2xl font-bold text-slate-400 mb-2">No Experiences Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base">Add your first professional experience to showcase your career journey.</p>
            <button 
              onClick={() => setFormData({ title: "", duration: "", description: "", image: null })}
              className="flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl sm:rounded-3xl hover:from-emerald-500 hover:to-teal-500 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 min-h-[44px]"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add First Experience</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {experiences.map((exp) => (
              <div 
                key={exp._id} 
                className={`group relative bg-slate-900/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 p-6 sm:p-8 hover:border-emerald-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
                  editingId === exp._id ? 'ring-2 ring-emerald-500/50 border-emerald-500/75 scale-105' : ''
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                
                {/* Logo */}
                <div className="relative mb-4 sm:mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center overflow-hidden mx-auto shadow-xl group-hover:shadow-emerald-500/25 transition-all">
                    {exp.image ? (
                      <img src={exp.image} alt="Company" className="w-full h-full object-contain p-1 sm:p-2" />
                    ) : (
                      <FiAward className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-3 sm:space-y-4 text-center">
                  <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1 px-2">{exp.title}</h3>
                  <div className="bg-slate-800/50 px-3 py-2 rounded-xl backdrop-blur-sm border border-slate-700/50 mx-2 sm:mx-0">
                    <p className="text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider line-clamp-1">
                      {exp.duration}
                    </p>
                  </div>
                  <p className="text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-3 text-sm px-2 sm:px-4">{exp.description}</p>
                  
                  {/* Action Buttons - ALWAYS VISIBLE ON MOBILE */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(exp);
                      }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
                    >
                      <FiEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(exp._id);
                      }}
                                           className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-6 sm:py-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:text-red-200 hover:border-red-500/50 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}