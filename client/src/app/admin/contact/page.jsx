"use client"

import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiTrash2, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";

export default function AdminContact(){
    const [contacts,setContacts] = useState([])
    const [loading, setLoading] =useState(true)
    
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

    const handleDelete = async (contactId, contactName) => {
        // Native browser confirmation - PERFECTLY RESPONSIVE
        const shouldDelete = window.confirm(
            `Delete message from "${contactName}"?\n\nThis action cannot be undone.`
        );
        
        if (!shouldDelete) return;

        try {
            const res = await fetch(`/api/contact/${contactId}`, { method: "DELETE" });

            if (res.ok) {
                setContacts(contacts.filter((c) => c._id !== contactId));
                toast.success("Message deleted successfully!");
            } else {
                toast.error("Failed to delete message");
            }  
        } catch (error) {
            console.error("Error:", error);
            toast.error("Error deleting message");
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
                                {/* Profile Card */}
                                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all">
                                    <div className="text-center sm:flex sm:items-center sm:gap-4 sm:text-left">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-xl flex-shrink-0 mx-auto sm:mx-0 mb-4 sm:mb-0">
                                            <CgProfile className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <h3 className="text-xl font-bold text-white truncate">{contact.name}</h3>
                                            
                                            {/* Contact Info */}
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
                                    onClick={() => handleDelete(contact._id, contact.name)}
                                    className="group w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 hover:text-red-100 transition-all duration-300 rounded-2xl backdrop-blur-sm shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5 font-semibold min-h-[52px]"
                                >
                                    <FiTrash2 className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                                    <span>Delete Message</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}