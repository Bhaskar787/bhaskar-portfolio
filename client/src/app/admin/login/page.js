// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";
// import { toast } from "sonner";
// import gsap from "gsap";
// import {
//   RiLockPasswordLine,
//   RiMailLine,
//   RiEyeLine,
//   RiEyeOffLine,
//   RiShieldCheckLine,
//   RiArrowRightLine,
// } from "react-icons/ri";
// import { HiCode } from "react-icons/hi";
// import ThemeToggle from "../../components/ThemeToggle";

// export default function AdminLogin() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);
//   const router = useRouter();
//   const cardRef = useRef(null);

//   useEffect(() => {
//     if (cardRef.current) {
//       gsap.fromTo(
//         cardRef.current,
//         { y: 32, opacity: 0, scale: 0.97 },
//         { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "power3.out", delay: 0.1 }
//       );
//     }
//   }, []);

//   const handleChange = (e) => {
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (res.ok && data.token) {
//         Cookies.set("admin_token", data.token, { expires: 7, sameSite: "strict" });
//         toast.success("Welcome back!");
//         router.push("/admin");
//         router.refresh();
//       } else {
//         toast.error(data.error || "Invalid credentials. Please try again.");
//       }
//     } catch {
//       toast.error("Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         background: "var(--bg)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "1.5rem",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
//         <ThemeToggle size={40} />
//       </div>

//       {/* Background blobs */}
//       <div
//         style={{
//           position: "fixed",
//           top: "20%",
//           left: "60%",
//           width: 500,
//           height: 500,
//           borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(var(--accent-rgb),0.18) 0%, transparent 70%)",
//           filter: "blur(60px)",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           bottom: "20%",
//           left: "30%",
//           width: 380,
//           height: 380,
//           borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(var(--accent2-rgb),0.14) 0%, transparent 70%)",
//           filter: "blur(60px)",
//           pointerEvents: "none",
//         }}
//       />

//       {/* Grid bg */}
//       <div
//         style={{
//           position: "fixed",
//           inset: 0,
//           backgroundImage:
//             "linear-gradient(rgba(var(--accent-rgb),0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.04) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//           maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
//           pointerEvents: "none",
//         }}
//       />

//       <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
//         {/* Brand */}
//         <div style={{ textAlign: "center", marginBottom: "2rem" }}>
//           <div
//             style={{
//               width: 56,
//               height: 56,
//               background: "linear-gradient(135deg, var(--accent), var(--accent2))",
//               borderRadius: "16px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontWeight: 900,
//               fontSize: "1.15rem",
//               color: "var(--on-accent)",
//               margin: "0 auto 1rem",
//               boxShadow: "0 8px 32px rgba(var(--accent-rgb),0.4)",
//             }}
//           >
//             BB
//           </div>
//           <h1
//             style={{
//               fontSize: "1.6rem",
//               fontWeight: 900,
//               color: "var(--text-primary)",
//               letterSpacing: "-0.03em",
//               marginBottom: "0.4rem",
//             }}
//           >
//             Admin Portal
//           </h1>
//           <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
//             Sign in to manage your portfolio
//           </p>
//         </div>

//         {/* Card */}
//         <div
//           ref={cardRef}
//           style={{
//             background: "rgba(16,16,30,0.9)",
//             border: "1px solid var(--border)",
//             borderRadius: "1.5rem",
//             padding: "clamp(1.75rem, 5vw, 2.5rem)",
//             backdropFilter: "blur(16px)",
//             boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(var(--accent-rgb),0.08)",
//           }}
//         >
//           <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
//             {/* Email */}
//             <div>
//               <label htmlFor="email" className="form-label">Email Address</label>
//               <div style={{ position: "relative" }}>
//                 <span
//                   style={{
//                     position: "absolute",
//                     left: "0.875rem",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "var(--muted)",
//                     fontSize: "1.05rem",
//                     display: "flex",
//                     pointerEvents: "none",
//                   }}
//                 >
//                   <RiMailLine />
//                 </span>
//                 <input
//                   id="email"
//                   type="email"
//                   name="email"
//                   required
//                   value={form.email}
//                   onChange={handleChange}
//                   placeholder="admin@example.com"
//                   style={{ paddingLeft: "2.75rem" }}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label htmlFor="password" className="form-label">Password</label>
//               <div style={{ position: "relative" }}>
//                 <span
//                   style={{
//                     position: "absolute",
//                     left: "0.875rem",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     color: "var(--muted)",
//                     fontSize: "1.05rem",
//                     display: "flex",
//                     pointerEvents: "none",
//                   }}
//                 >
//                   <RiLockPasswordLine />
//                 </span>
//                 <input
//                   id="password"
//                   type={showPass ? "text" : "password"}
//                   name="password"
//                   required
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="••••••••"
//                   style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPass(!showPass)}
//                   style={{
//                     position: "absolute",
//                     right: "0.875rem",
//                     top: "50%",
//                     transform: "translateY(-50%)",
//                     background: "none",
//                     border: "none",
//                     cursor: "pointer",
//                     color: "var(--muted)",
//                     fontSize: "1.05rem",
//                     display: "flex",
//                     alignItems: "center",
//                     padding: 0,
//                   }}
//                 >
//                   {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary"
//               style={{
//                 width: "100%",
//                 justifyContent: "center",
//                 padding: "0.9rem",
//                 fontSize: "1rem",
//                 marginTop: "0.25rem",
//                 opacity: loading ? 0.65 : 1,
//                 cursor: loading ? "not-allowed" : "pointer",
//                 borderRadius: "0.875rem",
//               }}
//             >
//               {loading ? (
//                 "Signing in…"
//               ) : (
//                 <>
//                   Sign In <RiArrowRightLine />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               gap: "0.75rem",
//               margin: "1.5rem 0",
//             }}
//           >
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//             <span style={{ color: "var(--muted)", fontSize: "0.78rem", fontWeight: 600 }}>OR</span>
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//           </div>

//           {/* Register link */}
//           <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
//             Don't have an account?{" "}
//             <a
//               href="/admin/register"
//               style={{
//                 color: "var(--accent)",
//                 fontWeight: 700,
//                 textDecoration: "none",
//                 transition: "color 0.2s",
//               }}
//               onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-tint)"; }}
//               onMouseLeave={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
//             >
//               Create one
//             </a>
//           </p>
//         </div>

//         {/* Security note */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             gap: "0.4rem",
//             marginTop: "1.25rem",
//             color: "var(--muted)",
//             fontSize: "0.78rem",
//             fontWeight: 600,
//           }}
//         >
//           <RiShieldCheckLine style={{ color: "#22c55e", fontSize: "0.9rem" }} />
//           Secured with JWT authentication
//         </div>

//         {/* Back to site */}
//         <div style={{ textAlign: "center", marginTop: "1rem" }}>
//           <a
//             href="/"
//             style={{
//               display: "inline-flex",
//               alignItems: "center",
//               gap: "0.4rem",
//               color: "var(--muted)",
//               fontSize: "0.82rem",
//               textDecoration: "none",
//               transition: "color 0.2s",
//             }}
//             onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
//             onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
//           >
//             <HiCode style={{ fontSize: "0.9rem" }} />
//             Back to portfolio
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import gsap from "gsap";
import {
  RiLockPasswordLine,
  RiMailLine,
  RiEyeLine,
  RiEyeOffLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { HiCode } from "react-icons/hi";
import ThemeToggle from "../../components/ThemeToggle";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const router = useRouter();
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 32, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.75, ease: "power3.out", delay: 0.1 }
      );
    }
  }, []);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        Cookies.set("admin_token", data.token, { expires: 7, sameSite: "strict" });
        toast.success("Welcome back!");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "fixed", top: "1.5rem", right: "1.5rem", zIndex: 10 }}>
        <ThemeToggle size={40} />
      </div>

      {/* Background blobs */}
      <div
        style={{
          position: "fixed",
          top: "20%",
          left: "60%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent-rgb),0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "20%",
          left: "30%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(var(--accent2-rgb),0.14) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Grid bg */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(var(--accent-rgb),0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--accent-rgb),0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 900,
              fontSize: "1.15rem",
              color: "var(--on-accent)",
              margin: "0 auto 1rem",
              boxShadow: "0 8px 32px rgba(var(--accent-rgb),0.4)",
            }}
          >
            BB
          </div>
          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "0.4rem",
            }}
          >
            Admin Portal
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Card */}
        <div
          ref={cardRef}
          style={{
            background: "rgba(16,16,30,0.9)",
            border: "1px solid var(--border)",
            borderRadius: "1.5rem",
            padding: "clamp(1.75rem, 5vw, 2.5rem)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(var(--accent-rgb),0.08)",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                    fontSize: "1.05rem",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <RiMailLine />
                </span>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                  style={{ paddingLeft: "2.75rem" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--muted)",
                    fontSize: "1.05rem",
                    display: "flex",
                    pointerEvents: "none",
                  }}
                >
                  <RiLockPasswordLine />
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{ paddingLeft: "2.75rem", paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--muted)",
                    fontSize: "1.05rem",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  {showPass ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "0.9rem",
                fontSize: "1rem",
                marginTop: "0.25rem",
                opacity: loading ? 0.65 : 1,
                cursor: loading ? "not-allowed" : "pointer",
                borderRadius: "0.875rem",
              }}
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign In <RiArrowRightLine />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security note */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.4rem",
            marginTop: "1.25rem",
            color: "var(--muted)",
            fontSize: "0.78rem",
            fontWeight: 600,
          }}
        >
          <RiShieldCheckLine style={{ color: "#22c55e", fontSize: "0.9rem" }} />
          Secured with JWT authentication
        </div>

        {/* Back to site */}
        <div style={{ textAlign: "center", marginTop: "1rem" }}>
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              color: "var(--muted)",
              fontSize: "0.82rem",
              textDecoration: "none",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--muted)"; }}
          >
            <HiCode style={{ fontSize: "0.9rem" }} />
            Back to portfolio
          </a>
        </div>
      </div>
    </div>
  );
}