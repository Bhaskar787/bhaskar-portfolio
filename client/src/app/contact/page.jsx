"use client"

import { useState } from "react"

export default function Contact(){
   //creating initial state for the form fields
   const [formData, setFormData] = useState({
    name :"",
    email :"",
    phone : "",
    message : "",
   })

   const [loading,setLoading] = useState(false)
   const [ status, setStatus] = useState("")

   // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

   //handle form submission
   const handleSubmit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    setStatus("")

    try {
      const res = await fetch ("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(formData)
      })

      if (res.ok){
        setStatus("Message Sent SuccessFully")
        setFormData({name : "", email: "", phone: "", message: ""})
      }else{
        const data = await res.json()
        setStatus(`Error: ${data.error || "Failed to Send "}`)
      }
    } catch (error) {
      setStatus("Somethinf went wrong. Please try again")
      
    }finally{
      setLoading(false)
    }
   }

   return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-500">Contact Me</h1>

      {/* Contact Links */}
      <div className="mt-8 text-white flex flex-wrap gap-4 items-center">
        <span>
          <a href="mailto:budhabhaskar11@gmail.com" className="text-purple-500 hover:text-purple-700">
            budhabhaskar11@gmail.com
          </a>
        </span>
        <span>|</span>
        <span>
          <a href="tel:+9779841234567" className="text-purple-500 hover:text-purple-700">
            +977 9841234567
          </a>
        </span>
        <span>|</span>
        <span>
          <a href="https://www.linkedin.com/in/bhaskar-budha-1a58b83b6" className="text-purple-500 hover:text-purple-700">
            linkedin
          </a>
        </span>
      </div>

      <p className="text-white mb-8 mt-2">
        If you have any questions or would like to get in touch, please feel free to contact me:
      </p>

      {/* Contact Form */}
      <form onSubmit={handleSubmit} className="flex flex-col max-w-md space-y-4">
        <div className="flex flex-col">
          <label className="text-white mb-1">Your Name</label>
          <input
            type="text"
            name="name" // Important: matches state key
            required
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Your Message</label>
          <textarea
            name="message"
            rows="4"
            required
            value={formData.message}
            onChange={handleChange}
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-purple-800" : "bg-purple-500 hover:bg-purple-700"
          } text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full`}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {/* Status Message Display */}
        {status && (
          <p className={`mt-2 text-sm ${status.includes("Error") ? "text-red-400" : "text-green-400"}`}>
            {status}
          </p>
        )}
      </form>
    </div>
  );
}
