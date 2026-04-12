export default function services() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text mb-8 text-slate-500">
                My Services
            </h1>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-8">
                <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-laptop"> </i>Web Development</h2>
                    <p className="text-white mt-4">
                        I offer full-stack web development services using modern technologies like React, Node.js, Express.js, and MongoDB. I can create responsive and user-friendly websites tailored to your needs.
                    </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-phone"> </i>Responsive Design</h2>
                    <p className="text-white mt-4">
                       
                       Mobile-first, responsive designs that work seamlessly across all devices and screen sizes.
                    </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-server"> </i>Backend Developer</h2>
                    <p className="text-white mt-4">
                        

                          Robust backend solutions with APIs, databases, and server-side logic.
                    </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-globe"> </i>Web Application</h2>
                    <p className="text-white mt-4">
                     
                     Full-stack web applications with complex features and seamless user experiences and responsive designs.
                     Mobile and desktop-friendly interfaces that adapt to any screen size. Fully responsive layout. 
                    </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-paint-bucket"> </i>UI/UX Design</h2>
                    <p className="text-white mt-4">
                       
                    Beautiful, intuitive interfaces designed with user experience in mind.
                    </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-lg">
                    <h2 className="text-xl font-bold text-white mb-4"><i className="bi bi-cart"> </i> E-Commerce Solutions</h2>
                    <p className="text-white mt-4">
                      
                     Complete e-commerce platforms with payment integration and inventory management.
                    </p>
                    </div>

                    </div>

                    <div className="space-x-4 justify-center mt-12 flex">
           
            <a href="/contact" className="px-6 py-2 border border-purple-500 text-purple-500 rounded-full hover:bg-purple-500 hover:text-white transition-all">Start a Project</a>
          </div>
                    



           
        </div>
    )
}