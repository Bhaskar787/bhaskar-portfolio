// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import gsap from "gsap";
// import {
//   RiLockPasswordLine,
//   RiMailLine,
//   RiUserLine,
//   RiEyeLine,
//   RiEyeOffLine,
//   RiShieldCheckLine,
//   RiArrowRightLine,
// } from "react-icons/ri";
// import { HiCode } from "react-icons/hi";
// import ThemeToggle from "../../components/ThemeToggle";

// export default function AdminRegister() {
//   const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
//   const [loading, setLoading] = useState(false);
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
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
//     if (form.password !== form.confirmPassword) {
//       toast.error("Passwords do not match.");
//       return;
//     }
//     if (form.password.length < 8) {
//       toast.error("Password must be at least 8 characters.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         toast.success("Account created! Please sign in.");
//         router.push("/admin/login");
//       } else {
//         toast.error(data.error || "Registration failed. Please try again.");
//       }
//     } catch {
//       toast.error("Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const passwordStrength = () => {
//     const p = form.password;
//     if (!p) return null;
//     if (p.length < 6) return { label: "Weak", color: "#ef4444", pct: 25 };
//     if (p.length < 10 || !/[A-Z]/.test(p) || !/[0-9]/.test(p)) return { label: "Fair", color: "#f59e0b", pct: 55 };
//     return { label: "Strong", color: "#22c55e", pct: 100 };
//   };

//   const strength = passwordStrength();

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
//           top: "15%",
//           right: "15%",
//           width: 500,
//           height: 500,
//           borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(var(--accent-rgb),0.15) 0%, transparent 70%)",
//           filter: "blur(60px)",
//           pointerEvents: "none",
//         }}
//       />
//       <div
//         style={{
//           position: "fixed",
//           bottom: "10%",
//           left: "20%",
//           width: 380,
//           height: 380,
//           borderRadius: "50%",
//           background: "radial-gradient(circle, rgba(var(--accent2-rgb),0.12) 0%, transparent 70%)",
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

//       <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
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
//             Create Account
//           </h1>
//           <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
//             Set up your portfolio admin account
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
//           <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
//             {/* Name */}
//             <div>
//               <label htmlFor="name" className="form-label">Full Name</label>
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
//                   <RiUserLine />
//                 </span>
//                 <input
//                   id="name"
//                   type="text"
//                   name="name"
//                   required
//                   value={form.name}
//                   onChange={handleChange}
//                   placeholder="Bhaskar Budha"
//                   style={{ paddingLeft: "2.75rem" }}
//                 />
//               </div>
//             </div>

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
//                   minLength={8}
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Min. 8 characters"
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

//               {/* Strength bar */}
//               {strength && (
//                 <div style={{ marginTop: "0.5rem" }}>
//                   <div
//                     style={{
//                       height: 4,
//                       background: "rgba(255,255,255,0.07)",
//                       borderRadius: 9999,
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: "100%",
//                         width: `${strength.pct}%`,
//                         background: strength.color,
//                         borderRadius: 9999,
//                         transition: "width 0.3s, background 0.3s",
//                       }}
//                     />
//                   </div>
//                   <p style={{ fontSize: "0.72rem", color: strength.color, fontWeight: 700, marginTop: "0.25rem" }}>
//                     {strength.label} password
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm Password */}
//             <div>
//               <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
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
//                   id="confirmPassword"
//                   type={showConfirm ? "text" : "password"}
//                   name="confirmPassword"
//                   required
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Repeat your password"
//                   style={{
//                     paddingLeft: "2.75rem",
//                     paddingRight: "2.75rem",
//                     borderColor:
//                       form.confirmPassword && form.password !== form.confirmPassword
//                         ? "rgba(239,68,68,0.6)"
//                         : undefined,
//                   }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirm(!showConfirm)}
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
//                   {showConfirm ? <RiEyeOffLine /> : <RiEyeLine />}
//                 </button>
//               </div>
//               {form.confirmPassword && form.password !== form.confirmPassword && (
//                 <p style={{ fontSize: "0.72rem", color: "#ef4444", fontWeight: 600, marginTop: "0.25rem" }}>
//                   Passwords do not match
//                 </p>
//               )}
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
//                 "Creating account…"
//               ) : (
//                 <>
//                   Create Account <RiArrowRightLine />
//                 </>
//               )}
//             </button>
//           </form>

//           {/* Divider */}
//           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "1.5rem 0" }}>
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//             <span style={{ color: "var(--muted)", fontSize: "0.78rem", fontWeight: 600 }}>OR</span>
//             <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
//           </div>

//           {/* Login link */}
//           <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
//             Already have an account?{" "}
//             <a
//               href="/admin/login"
//               style={{
//                 color: "var(--accent)",
//                 fontWeight: 700,
//                 textDecoration: "none",
//                 transition: "color 0.2s",
//               }}
//               onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-tint)"; }}
//               onMouseLeave={(e) => { e.currentTarget.style.color = "var(--accent)"; }}
//             >
//               Sign in
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
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Public self-registration is disabled for this site — the single admin
// account is created via `node scripts/create-admin.js` instead (see that
// file). Anyone landing on this URL is just bounced to the login page.
export default function RegisterDisabled() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/login");
  }, [router]);
  return null;
}
