"use client";
import { useState, useEffect } from "react";
import { FiLoader, FiPlus, FiTrash2, FiEdit, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(60);
  const [category, setCategory] = useState("Frontend");
  const [submitting, setSubmitting] = useState(false);
  
  // New state for editing
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    const res = await fetch("/api/skills");
    const data = await res.json();
    setSkills(data);
  };

  // Handle Edit click
  const handleEditClick = (skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setLevel(skill.level);
    setCategory(skill.category);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setLevel(60);
    setCategory("Frontend");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Determine if we are updating or creating
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
      toast.success(editingId ? "Skill Updated!" : "Skill Created!")
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this skill?")) return;
    await fetch(`/api/skills/${id}`, { method: "DELETE" });
    fetchSkills();
    toast.success("Skill deleted!")
    
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">
          {editingId ? "Edit Skill" : "Skills Management"}
        </h1>
        
      </div>
      
      {/* Form handles both Add and Update */}
      <form onSubmit={handleSubmit} className={`flex flex-wrap gap-4 p-4 rounded-lg shadow border transition-all ${editingId ? 'bg-purple-50 border-purple-200' : 'bg-white border-slate-200'}`}>
        <input 
          className="border p-2 rounded flex-1 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500" 
          placeholder="Skill Name (e.g. React)"
          value={name} onChange={(e) => setName(e.target.value)}
          required
        />
        <select 
          className="border p-2 rounded text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"  
          value={category} onChange={(e) => setCategory(e.target.value)}
        >
          <option>Frontend</option>
          <option>Backend</option>
          <option>Database</option>
          <option>Tools</option>
          <option>Other</option>
        </select>
        <input 
          type="number" 
          className="border p-2 rounded w-20 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500" 
          value={level} onChange={(e) => setLevel(e.target.value)}
          max="100" min="0"
        />
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
    {editingId ? "Update Skill" : "Add Skill"}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill._id} className={`bg-white p-4 rounded border flex justify-between items-center shadow-sm hover:shadow-md transition-shadow ${editingId === skill._id ? 'border-purple-500 ring-1 ring-purple-500' : 'border-slate-200'}`}>
            <div>
              <p className="font-bold text-slate-800">{skill.name}</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{skill.category} • {skill.level}%</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => handleEditClick(skill)} 
                className="text-blue-500 hover:bg-blue-50 p-2 rounded transition-colors"
                title="Edit"
              >
                <FiEdit size={18} />
              </button>
              <button 
                onClick={() => handleDelete(skill._id)} 
                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                title="Delete"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}