"use client";
import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit, FiLoader, FiX, FiBookOpen } from "react-icons/fi";
import { toast } from "react-toastify";

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
      toast.error("Failed to fetch education records");
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

      const data = new FormData();
      data.append("institution", formData.institution);
      data.append("degree", formData.degree);
      data.append("duration", formData.duration);
      data.append("description", formData.description);

      const res = await fetch(url, {
        method: method,
        body: data,
      });
      
      if (res.ok) {
        fetchEducation();
        cancelEdit();
        toast.success(editingId ? "Education Updated!" : "Education Added!");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Submission failed");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this education record permanently?")) return;
    try {
      const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchEducation();
        toast.success("Education Deleted!");
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
          <p className="text-slate-400 text-lg">Loading education records...</p>
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
            Education Management
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">Manage your academic achievements and qualifications</p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-bold text-white">{education.length}</span>
          <p className="text-sm text-slate-400">Total Records</p>
        </div>
      </div>

      {/* Add/Edit Form - MOBILE RESPONSIVE */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {editingId ? "Edit Education Record" : "Add New Education"}
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
            {/* Institution */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Institution / University
              </label>
              <input
                type="text"
                placeholder="e.g. Harvard University, Tribhuvan University"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/75 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Degree / Qualification
              </label>
              <input
                type="text"
                placeholder="e.g. Bachelor's in Computer Science"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/75 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Duration */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Duration / Year
              </label>
              <input
                type="text"
                placeholder="e.g. 2019 - 2023"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/75 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div className="lg:col-span-2">
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Description / Achievements
              </label>
              <textarea
                rows="3"
                placeholder="Highlight key achievements, GPA, relevant coursework, etc..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-indigo-500/75 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 text-base sm:text-lg resize-vertical shadow-inner hover:border-slate-600/75 min-h-[100px] sm:min-h-[120px]"
              />
            </div>
          </div>

          {/* Action Buttons - MOBILE STACKED */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={submitting || !formData.institution.trim()}
              className={`group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-500 flex-1 min-h-[44px] sm:min-w-[220px] ${
                submitting || !formData.institution.trim()
                  ? 'bg-slate-700/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:via-indigo-600 hover:to-purple-500 text-white border border-indigo-500/50 hover:shadow-indigo-500/50 hover:-translate-y-1 hover:scale-[1.02] shadow-indigo-500/25'
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
                  <span className="text-sm sm:text-base">{editingId ? "Update Record" : "Add Education"}</span>
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

      {/* Education Records Grid */}
      <div className="space-y-6 animate-slide-in-up delay-400">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
            <FiBookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-400" />
            Academic Records ({education.length})
          </h2>
        </div>
        
        {education.length === 0 ? (
          <div className="grid place-items-center py-16 sm:py-20 bg-slate-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 text-center">
            <FiBookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg sm:text-2xl font-bold text-slate-400 mb-2">No Education Records</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base">Add your academic qualifications to showcase your educational background.</p>
            <button 
              onClick={() => setFormData({ institution: "", degree: "", duration: "", description: "" })}
              className="flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl sm:rounded-3xl hover:from-indigo-500 hover:to-purple-500 shadow-2xl hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all duration-300 min-h-[44px]"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add First Record</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {education.map((edu) => (
              <div 
                key={edu._id} 
                className={`group relative bg-slate-900/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 p-6 sm:p-8 hover:border-indigo-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-indigo-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
                  editingId === edu._id ? 'ring-2 ring-indigo-500/50 border-indigo-500/75 scale-105' : ''
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 space-y-3 sm:space-y-4 text-center">
                  <h3 className="text-lg sm:text-xl font-black text-white line-clamp-1 px-2">{edu.degree}</h3>
                  <div className="bg-slate-800/50 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl backdrop-blur-sm border border-slate-700/50 mx-2 sm:mx-auto max-w-max">
                    <p className="text-indigo-400 font-bold text-xs sm:text-sm uppercase tracking-wider line-clamp-1">
                      {edu.institution}
                    </p>
                  </div>
                  <div className="bg-slate-800/30 px-3 sm:px-4 py-2 sm:py-3 rounded-xl backdrop-blur-sm border border-slate-700/50 mx-2 sm:mx-0">
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-1">
                      {edu.duration}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed line-clamp-2 italic px-2 sm:px-0">
                      "{edu.description}"
                    </p>
                  )}
                  
                  {/* Action Buttons - ALWAYS VISIBLE ON MOBILE */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(edu);
                      }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
                    >
                      <FiEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(edu._id);
                      }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-6 sm:py-3 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:text-red-200 hover:border-red-500/50 rounded-xl sm:rounded-2xl transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete</span>
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