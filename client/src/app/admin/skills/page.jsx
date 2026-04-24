"use client";
import { useState, useEffect } from "react";
import { FiLoader, FiPlus, FiTrash2, FiEdit, FiX, FiCheck,FiCode  } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(60);
  const [category, setCategory] = useState("Frontend");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
  };

  const handleEditClick = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setLevel(skill.level);
    setCategory(skill.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setLevel(60);
    setCategory("Frontend");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const url = editingId ? `/api/skills/${editingId}` : "/api/skills";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, level, category }),
    });

    if (res.ok) {
      cancelEdit();
      fetchSkills();
      toast.success(editingId ? "Skill Updated!" : "Skill Added!");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill permanently?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
    toast.success("Skill Deleted!");
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2 leading-tight">
            Skills Management
          </h1>
          <p className="text-lg sm:text-xl text-slate-400">Manage your skillset and proficiency levels</p>
        </div>
      </div>

      {/* Form Card - MOBILE RESPONSIVE */}
      <div className="bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl animate-slide-in-up delay-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Skill Name */}
          <div className="lg:col-span-1">
            <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
              Skill Name
            </label>
            <div className="relative">
              <input 
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 min-h-[44px]"
                placeholder="React, Node.js, etc."
                value={name} 
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="lg:col-span-1">
            <label className="block text-slate-300 font-semibold mb-3 text-base sm:text-lg">
              Category
            </label>
            <div className="relative">
              <select 
                className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base sm:text-lg shadow-inner hover:border-slate-600/75 appearance-none bg-no-repeat bg-right min-h-[44px]"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="Tools">Tools</option>
                <option value="DevOps">DevOps</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Proficiency Level */}
          <div className="lg:col-span-1 space-y-3">
            <label className="block text-slate-300 font-semibold text-base sm:text-lg">
              Proficiency
            </label>
            <div className="relative">
              <input 
                type="range" 
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                min="0" max="100" step="5"
                value={level} 
                onChange={(e) => setLevel(e.target.value)}
              />
              <div className="flex justify-between text-xs sm:text-sm text-slate-400 mt-2">
                <span>0%</span>
                <span className="font-bold text-purple-400">{level}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - MOBILE STACKED */}
          <div className="lg:col-span-3 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className={`group relative flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 font-bold text-base sm:text-lg rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 flex-1 min-h-[44px] sm:min-w-[200px] ${
                submitting || !name.trim()
                  ? 'bg-slate-700/50 border border-slate-600/50 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-500 text-white border border-purple-500/50 hover:shadow-purple-500/50 hover:-translate-y-1 hover:scale-[1.02] shadow-purple-500/25'
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
                  <span className="text-sm sm:text-base">{editingId ? "Update Skill" : "Add New Skill"}</span>
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
                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/25 hover:-translate-y-0.5 flex-1 sm:flex-none min-h-[44px]"
              >
                <FiX className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Cancel</span>
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Skills Grid */}
      <div className="space-y-6 animate-slide-in-up delay-400">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white">Skills Overview ({skills.length})</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {skills.length === 0 ? (
            <div className="col-span-full text-center py-16 sm:py-20 bg-slate-900/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-800/50">
              <FiCode className="w-12 h-12 sm:w-16 sm:h-16 text-slate-500 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-400 mb-2">No Skills Yet</h3>
              <p className="text-slate-500 text-sm sm:text-base">Add your first skill using the form above</p>
            </div>
          ) : (
            skills.map((skill) => (
              <div 
                key={skill._id} 
                className={`group relative bg-slate-900/70 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-800/50 hover:border-purple-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-purple-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden ${
                  editingId === skill._id ? 'ring-2 ring-purple-500/50 border-purple-500/75 scale-105' : ''
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                <div className="relative z-10 space-y-4">
                  {/* Skill Header - MOBILE RESPONSIVE */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl sm:text-2xl font-black text-white mb-1 truncate">{skill.name}</h3>
                      <p className="text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider">
                        {skill.category}
                      </p>
                    </div>
                    
                    {/* Action Buttons - ALWAYS VISIBLE ON MOBILE */}
                    <div className="flex gap-2 pt-2 sm:pt-0 sm:opacity-0 sm:group-hover:opacity-100 sm:transition-all sm:duration-300 ml-auto sm:ml-0">
                      <button 
                        onClick={() => handleEditClick(skill)} 
                        className="flex items-center justify-center p-2.5 sm:p-3 hover:bg-white/10 rounded-xl sm:rounded-2xl text-blue-400 hover:text-blue-300 transition-all shadow-lg hover:shadow-blue-500/25 hover:scale-105 min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto"
                        title="Edit Skill"
                      >
                        <FiEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(skill._id)} 
                        className="flex items-center justify-center p-2.5 sm:p-3 hover:bg-white/10 rounded-xl sm:rounded-2xl text-red-400 hover:text-red-300 transition-all shadow-lg hover:shadow-red-500/25 hover:scale-105 min-w-[40px] h-[40px] sm:min-w-0 sm:h-auto"
                        title="Delete Skill"
                      >
                        <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-slate-400 font-medium">Proficiency</span>
                      <span className="text-white font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-800/50 rounded-full h-2.5 sm:h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full shadow-lg transition-all duration-700 flex items-center justify-end pr-1 sm:pr-2"
                        style={{ width: `${skill.level}%` }}
                      >
                        <span className="text-[10px] sm:text-xs font-bold text-white drop-shadow-md hidden sm:block">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}