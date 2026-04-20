"use client"

import { useEffect, useState } from "react"
import { CgProfile } from "react-icons/cg";
import { FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "react-toastify";


export default function  AdminContact(){
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
            
        }finally{
            setLoading(false)
        }
    }

    const deleteContact = async (id)=>{
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            const res = await fetch(`/api/contact/${id}`, {method : "DELETE"})

        if(res.ok){
            setContacts(contacts.filter((c)=>c._id !== id))
            toast.success("Contact Deleted Successfulyy!")
        }  else{
            throw new toast.error("Failed to delete")
        }  
            
        } catch (error) {
            console.error("Error:", error)
            toast.error("Error deleting message")
            
        }
    }

    useEffect(()=>{
        fetchContacts()
    },[])
    return(
        <div className="space-y-12">

            <h1 className="text-4xl font semibold text-center text-gray-900"> Admin Contact Management.</h1>

            {/* grid container */}

            <div className="bg-white p-10 rounded-xl border border-gray-200 shadow-sm">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
    {contacts.map((contact) => (
      <div
        key={contact._id}
        className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex flex-col items-center gap-6"
      >
        {/* box for client info */}
        <div className="border border-gray-300 rounded p-5 bg-white w-full text-center">
          <p className="font-semibold text-gray-900  flex items-center justify-center gap-2"> <CgProfile />{contact.name}</p>
          <p className="font-semibold text-gray-700 text-sm flex items-center justify-center gap-2"><MdEmail className="text-gray-600" />{contact.email}</p>

          <p className="font-semibold text-gray-700 text-sm flex items-center justify-center gap-2">
            <FaPhoneAlt className="text-gray-600" />
            {contact.phone}
          </p>
        </div>
      



              {/* box for the message from the client */}
              <div className="border border-gray-300 rounded p-5 bg-white w-full">
                <p className="text-gray-700 italic">“{contact.message}”</p>

                {/* Timestamp Display */}
                <div className="mt-4 pt-2 border-t border-gray-100 text-[10px] text-gray-400 text-right uppercase tracking-wider">
                  Received: {new Date(contact.createdAt).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                </div>
              </div>

              {/* delete  button */}
              <button
                onClick={() => deleteContact(contact._id)}
                className="w-full bg-red-600 text-white font-medium px-5 py-3 rounded-lg hover:bg-red-700 transition">
                Delete Message
              </button>
                             
                        </div>
                    ))}

                    {contacts.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-400">
              No client messages found.
            </div>
          )}

                </div>

            </div>
            
        </div>
   
    )
}