"use client"
import { useState, useEffect } from "react";
import { FiLoader, FiPlus, FiTrash2, FiEdit, FiX, FiGithub, FiImage,FiBriefcase } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for form handling (both create and edit)
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    description: "",
    githubLink: "",
    image: null,
  });

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      toast.error("Failed to fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Create/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isEditing = !!formData._id;
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("githubLink", formData.githubLink);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      const url = isEditing ? `/api/project/${formData._id}` : "/api/project";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        body: data,
      });

      if (res.ok) {
        toast.success(isEditing ? "Project Updated!" : "Project Created!");
        setFormData({ _id: null, title: "", description: "", githubLink: "", image: null });
        fetchProjects();
      } else {
        toast.error("Action failed");
      }
    } catch (error) {
      toast.error("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  // Edit project
  const startEdit = (project) => {
    setFormData({
      _id: project._id,
      title: project.title,
      description: project.description,
      githubLink: project.githubLink,
      image: null, // Reset to allow new image upload
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete project
  const deleteProject = async (id) => {
    if (!confirm("Delete this project permanently?")) return;
    try {
      const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
        toast.success("Project deleted!");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2 leading-tight">
            Projects Management
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">Create, edit, and manage your portfolio projects</p>
        </div>
        <div className="text-right">
          <span className="text-xl sm:text-2xl font-bold text-white">{projects.length}</span>
          <p className="text-sm text-slate-400">Total Projects</p>
        </div>
      </div>

      {/* Add/Edit Form - MOBILE RESPONSIVE */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {formData._id ? "Edit Project" : "Add New Project"}
          </h2>
          {formData._id && (
            <button 
              onClick={() => setFormData({ _id: null, title: "", description: "", githubLink: "", image: null })}
              className="flex items-center justify-center gap-2 text-slate-400 hover:text-white px-4 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-slate-800/50 transition-all duration-300 w-full sm:w-auto min-h-[40px]"
            >
              <FiX className="w-4 h-4" />
              <span className="text-sm sm:text-base">Cancel Edit</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Title */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter project title..."
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Describe your project..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full px-4 sm:px-5 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base sm:text-lg resize-vertical shadow-inner hover:border-slate-600/75 min-h-[100px] sm:min-h-[120px]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* GitHub Link */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                GitHub Repository
              </label>
              <div className="relative">
                <FiGithub className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="url"
                  name="githubLink"
                  placeholder="https://github.com/username/project"
                  value={formData.githubLink}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
                Project Image
              </label>
              <div className="relative">
                <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5 z-10 pointer-events-none" />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white file:mr-4 file:py-2 sm:file:py-3 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-purple-600/20 file:text-purple-300 hover:file:bg-purple-600/30 hover:file:text-purple-200 transition-all cursor-pointer text-base sm:text-lg shadow-inner hover:border-purple-500/50 min-h-[44px]"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {formData._id ? "Keep existing or upload new" : "Recommended: 1200x600px"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons - MOBILE STACKED */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className={`group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-500 flex-1 min-h-[44px] sm:min-w-[220px] ${
                loading || !formData.title.trim()
                  ? 'bg-slate-700/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-500 text-white border border-purple-500/50 hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-[1.02] shadow-purple-500/25'
              }`}
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{formData._id ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  {formData._id ? <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" /> : <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />}
                  <span className="text-sm sm:text-base">{formData._id ? "Update Project" : "Create Project"}</span>
                </>
              )}
              {!loading && (
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl sm:rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              )}
            </button>

            {formData._id && (
              <button 
                type="button" 
                onClick={() => setFormData({ _id: null, title: "", description: "", githubLink: "", image: null })}
                className="flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/25 hover:-translate-y-0.5 flex-1 sm:flex-none min-h-[44px]"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Projects Grid */}
      <div className="space-y-6 animate-slide-in-up delay-400">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 sm:gap-3">
            <FiBriefcase className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            Projects ({projects.length})
          </h2>
        </div>
        
        {projects.length === 0 ? (
          <div className="grid place-items-center py-16 sm:py-20 bg-slate-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 text-center">
            <FiBriefcase className="w-16 h-16 sm:w-20 sm:h-20 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg sm:text-2xl font-bold text-slate-400 mb-2">No Projects Yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base">Create your first project using the form above to showcase your work.</p>
            <button 
              onClick={() => setFormData({ _id: null, title: "", description: "", githubLink: "", image: null })}
              className="flex items-center gap-2 px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl sm:rounded-3xl hover:from-emerald-500 hover:to-teal-500 shadow-2xl hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 min-h-[44px]"
            >
              <FiPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Add First Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <div 
                key={project._id} 
                className={`group relative bg-slate-900/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50 p-6 sm:p-8 hover:border-purple-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer ${
                  formData._id === project._id ? 'ring-2 ring-purple-500/50 border-purple-500/75 scale-105' : ''
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 sm:group-hover:opacity-100 transition-all duration-500 pointer-events-none" />
                
                {/* Image */}
                <div className="relative mb-4 sm:mb-6 overflow-hidden rounded-2xl">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl hover:bg-white hover:text-slate-900 shadow-lg transition-all">
                      <FiGithub className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-2 sm:space-y-3 px-1 sm:px-0">
                  <h3 className="text-base sm:text-xl font-black text-white line-clamp-1">{project.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 sm:line-clamp-2">{project.description}</p>
                  
                  {/* Action Buttons - ALWAYS VISIBLE ON MOBILE */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3 pt-4 sm:pt-6 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(project);
                      }}
                      className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-xl sm:rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
                    >
                      <FiEdit className="w-4 h-4 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project._id);
                      }}
                                           className="flex items-center justify-center gap-1.5 sm:gap-2 p-2.5 sm:px-4 sm:py-2 bg-red-500/20 backdrop-blur-sm border border-red-500/30 text-red-300 hover:bg-red-500/30 hover:text-red-200 hover:border-red-500/50 rounded-xl sm:rounded-xl transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105 font-medium min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto text-xs sm:text-sm"
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