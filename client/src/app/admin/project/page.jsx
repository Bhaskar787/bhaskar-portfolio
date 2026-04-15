"use client"
import { useState, useEffect } from "react";
import { FiGithub } from "react-icons/fi";

export default function AdminProjectPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State for form handling (both create and edit)
  const [formData, setFormData] = useState({
    _id: null, // Tracks if we are editing an existing project
    title: "",
    description: "",
    githubLink: "",
    image: null,
  });

  // 1. Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/project");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Fetch failed", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);
     

    // handle inputs
      const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
   // create and update
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
        alert(isEditing ? "Project Updated!" : "Project Created!");
        // Reset form to Create mode
        setFormData({ _id: null, title: "", description: "", githubLink: "", image: null });
        fetchProjects();
      } else {
        alert("Action failed. Check API.");
      }
    } catch (error) {
      console.error("Error submitting", error);
    } finally {
      setLoading(false);
    }
  };


    //set form for editing

   const startEdit = (project) => {
    // Populate form and set _id to indicate "Edit Mode"
    setFormData({
      _id: project._id,
      title: project.title,
      description: project.description,
      githubLink: project.githubLink,
      image: project.image, // URL of existing image
    });
    
    // Smooth scroll back to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete Project
  const deleteProject = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/project/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(projects.filter((p) => p._id !== id));
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

   return (
    <div className="space-y-12">
      {/* 1. Main Title from Wireframe */}
      <h1 className="text-4xl font-semibold text-center text-gray-900 tracking-tight">
        Admin Projects
      </h1>

      {/* 2. Manage Your Projects Box */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-8">Manage Your Projects</h2>
        
        {/* Wireframe Grid Layout for Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Project Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-purple-300 focus:outline-none"
              />
            </div>

            {/* Image Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Image</label>
              <input 
                type="file" 
                name="image" 
                onChange={handleChange} 
                className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              {formData._id && typeof formData.image === 'string' && (
                <p className="text-xs text-green-600 mt-1">Existing image will be kept.</p>
              )}
            </div>

           {/* GitHub URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">GitHub URL</label>
              <input
                type="url"
                name="githubLink"
                placeholder="https://github.com/username/project"
                value={formData.githubLink}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-purple-300 focus:outline-none"
              />
            </div>

            {/* Description Input */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
              <textarea
                name="description"
                placeholder="Project Description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-1 focus:ring-purple-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-10 py-3 rounded-lg transition duration-300 shadow active:scale-95 disabled:opacity-50"
            >
              {loading ? "Saving..." : (formData._id ? "Update Project" : "Add Project")}
            </button>
            {formData._id && (
              <button 
                type="button" 
                onClick={() => setFormData({ _id: null, title: "", description: "", githubLink: "", image: null })}
                className="ml-4 text-sm text-gray-500 hover:text-red-500"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* 3. Project List Box  */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <h2 className="text-sm font-bold text-gray-400 uppercase mb-8">Project List</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-10 text-gray-400">No projects added yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="border-b-2 border-gray-200 bg-gray-50">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600">Image</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">GitHub</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <img src={project.image} alt={project.title} className="w-20 h-12 object-cover rounded border" />
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">{project.title}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{project.description}</p>
                    </td>
                    <td className="p-4 text-sm">
                      <a href={project.githubLink} target="_blank" className="text-blue-600  hover:underline">View Code </a>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button 
                        onClick={() => startEdit(project)}
                        className="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteProject(project._id)}
                        className="text-xs font-semibold bg-red-50 text-red-600 px-3 py-1 rounded-md hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}