"use client"

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiTrash2, FiClock, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

// Responsive Confirmation Modal
const DeleteConfirmation = ({ isOpen, onClose, onConfirm, contactName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-slate-800/50 shadow-2xl shadow-red-500/10 w-full max-w-sm mx-4 p-6 sm:p-8 animate-slide-in-up">
        {/* Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-2xl border-2 border-red-500/30 flex items-center justify-center mx-auto mb-6">
          <FiTrash2 className="w-8 h-8 sm:w-12 sm:h-12 text-red-400" />
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black text-white text-center mb-3">
          Delete Message
        </h3>

        {/* Message */}
        <p className="text-slate-300 text-base sm:text-lg text-center mb-8 leading-relaxed">
          Are you sure you want to delete the message from <br />
          <span className="font-semibold text-white bg-slate-800/50 px-3 py-1 rounded-xl inline-block mt-1">
            {contactName}
          </span>
          ? <br />
          <span className="text-red-400 font-medium block mt-2">This action cannot be undone.</span>
        </p>

        {/* Buttons - Responsive Stack */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <button
            onClick={onConfirm}
            className="flex-1 group relative px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-2xl hover:from-red-500 hover:to-red-600 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all duration-300 shadow-red-500/25 overflow-hidden flex items-center justify-center gap-2"
          >
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl blur-sm transition-all scale-0 group-hover:scale-100" />
            <FiTrash2 className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Yes, Delete</span>
          </button>
          
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-300 hover:text-white hover:border-slate-600 font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-slate-500/25 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <FiX className="w-5 h-5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminContact(){
    const [contacts,setContacts] = useState([])
    const [loading, setLoading] =useState(true)
    
    // Confirmation Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, contactId: null, contactName: "" });

    const fetchContacts = async ()=> {
        try {
            const res = await fetch ("/api/contact")
            if(!res.ok) throw new Error ("Failed to Fetch")
                const data = await res.json()
            setContacts(data)
        } catch (error) {
            console.error("Error", error)
            toast.error("Failed to load messages")
        }finally{
            setLoading(false)
        }
    }

    const openDeleteModal = (id, name) => {
        setDeleteModal({ isOpen: true, contactId: id, contactName: name });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ isOpen: false, contactId: null, contactName: "" });
    };

    const confirmDelete = async () => {
        const { contactId } = deleteModal;
        if (!contactId) return;

        try {
            const res = await fetch(`/api/contact/${contactId}`, {method : "DELETE"})

            if(res.ok){
                setContacts(contacts.filter((c)=>c._id !== contactId))
                toast.success("Message deleted!")
            }  else{
                toast.error("Failed to delete")
            }  
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error deleting message")
        } finally {
            closeDeleteModal();
        }
    };

    useEffect(()=>{
        fetchContacts()
    },[])

    if (loading) {
      return (
        <div className="min-h-screen p-8 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-slate-800/50 border-t-slate-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-lg">Loading messages...</p>
          </div>
        </div>
      );
    }

    return(
        <>
            <div className="space-y-8 p-6 lg:p-8 min-h-screen">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-slide-in-up">
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
                            Contact Messages
                        </h1>
                        <p className="text-xl text-slate-400">Respond to client inquiries ({contacts.length})</p>
                    </div>
                </div>

                {/* Messages Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-slide-in-up delay-200">
                    {contacts.length === 0 ? (
                        <div className="col-span-full grid place-items-center py-24 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800/50 text-center">
                            <MdEmail className="w-24 h-24 text-slate-500 mx-auto mb-8 opacity-50" />
                            <h3 className="text-2xl font-bold text-slate-400 mb-3">No Messages Yet</h3>
                            <p className="text-slate-500 max-w-md mx-auto mb-8">Client inquiries will appear here when they contact you through the portfolio.</p>
                        </div>
                    ) : (
                        contacts.map((contact) => (
                            <div
                                key={contact._id}
                                className="group relative bg-slate-900/70 backdrop-blur-sm rounded-3xl border border-slate-800/50 p-8 hover:border-emerald-500/75 hover:bg-slate-900/90 hover:shadow-2xl hover:shadow-emerald-500/25 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                            >
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none" />

                                {/* Content */}
                                <div className="relative z-10 space-y-6">
                                    {/* Profile Card - VERTICAL LAYOUT */}
                                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
                                        <div className="text-center sm:flex sm:items-center sm:gap-4 sm:text-left">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl flex-shrink-0 mx-auto sm:mx-0 mb-4 sm:mb-0">
                                                <CgProfile className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <h3 className="text-xl font-bold text-white truncate">{contact.name}</h3>
                                                
                                                {/* VERTICAL EMAIL & PHONE */}
                                                <div className="space-y-1 text-sm text-slate-400">
                                                    <div className="flex items-center gap-2">
                                                        <MdEmail className="w-4 h-4 flex-shrink-0" />
                                                        <span className="truncate">{contact.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <FaPhoneAlt className="w-4 h-4 flex-shrink-0" />
                                                        <span>{contact.phone}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-400/50 transition-all">
                                        <p className="text-slate-200 leading-relaxed text-lg italic">
                                            "{contact.message}"
                                        </p>
                                    </div>

                                    {/* Timestamp */}
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <FiClock className="w-4 h-4" />
                                            <span>
                                                {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => openDeleteModal(contact._id, contact.name)}
                                        className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-100 transition-all duration-300 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 font-semibold"
                                    >
                                        <FiTrash2 className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        <span>Delete Message</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            <DeleteConfirmation 
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                contactName={deleteModal.contactName}
            />
        </>
    );
}