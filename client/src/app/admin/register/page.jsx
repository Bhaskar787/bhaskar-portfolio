"use client"

import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "react-toastify";

export default function AdminRegiter(){
    const [formData, setFormData]= useState({
        name:"",email:"", password: "",
        })

        const [error,setError]=useState("")
        const [loading,setLoading] = useState(false)
        const router = useRouter()


        //handle input chnages
        const handleChange = (e)=>{
            const {name,value}=e.target 
            setFormData((prev)=>({...prev, [name]:value}))
        }

        //handle form submission
        const handleSubmit = async (e) =>{
            e.preventDefault()
            setLoading(true)
            setError("")

            try {
                const res = await fetch ("/api/auth/register",{
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    body:JSON.stringify(formData)
                })
                const data = await res.json()
                if(res.ok){
                    //registration successful
                    toast.success("Admin registered Successfully")
                    router.push("/admin/login")
                }else{
                    toast.error(data.message || "Registration failed")
                    
                }
            } catch (error) {
                toast.error("Something went wrong. Please try again.")
            }finally{
                setLoading(false)
            }
        }
    return(
        <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-purple-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Bhaskar Admin</h1>
          <p className="text-purple-100 mt-2">Secure Access Point</p>
        </div>
        <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500p-4 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input type="name" name="name" required 
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" placeholder="Ram Chaudhary">
                    </input>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" required value={formData.email}
                onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" placeholder="admin@gmail.com">
                    </input>
                </div>


                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                    <input type="password" name="password" required
                    value={formData.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900" placeholder="••••••••">
                    </input>
                </div>
                <button type="submit" 
                disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg disabled:opacity-50">{loading? "Registering..." : "Register"} </button>

                <div className="text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <a href="/admin/login" className="text-purple-600 font-semibold hover:underline">
                  Login
                </a>
              </p>
            </div>

            </form>
            
        </div>

       
      </div>
    </div>
    )
}