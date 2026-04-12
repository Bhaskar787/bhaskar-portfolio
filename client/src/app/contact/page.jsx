export default function Contact() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-slate-500">Contact Me</h1>

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

    
      <form className="flex flex-col max-w-md space-y-4">
        
        <div className="flex flex-col">
          <label className="text-white mb-1">Your Name</label>
          <input 
            type="text" 
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500" 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Email</label>
          <input 
            type="email" 
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500" 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Phone Number</label>
          <input 
            type="tel" 
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500" 
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white mb-1">Your Message</label>
          <textarea 
            rows="4"
            className="p-2 rounded bg-slate-800 text-white border border-slate-700 focus:outline-none focus:border-purple-500"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 w-full"
        >
          Send Message
        </button>
      </form>
      
      
    </div>
  );
}