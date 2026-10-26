"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

/**
 * Hardware-Accelerated WebGL Fluid Simulation Smoke Cursor.
 * Inspired by houseofdreamers.com:
 * 
 * 1. Fluid Simulation:
 *    - Double-buffered ping-pong FBOs at 512x512 with half-float / float textures.
 *    - Semi-Lagrangian velocity and density advection with neighbor diffusion.
 *    - Soft Gaussian splats injecting velocity (mouse delta) and smoke density.
 *    - Trails linger floaty and dreamy for 2-3 seconds with smooth dissipation.
 * 
 * 2. Volumetric Display Pass:
 *    - Dark Mode: Pastel pink, soft lavender, electric violet, and atmospheric cyan
 *      with luminous soft white cloud haze in dense centers.
 *    - Light Mode: Luxury champagne gold, warm amber, and pearl white haze.
 *    - Pre-multiplied alpha rendering eliminates hard edges or color banding.
 * 
 * 3. Interactive Custom Cursor:
 *    - Translucent focal ring tracked via gsap.quickTo (duration ~0.6, power3.out).
 *    - Smooth scale-up interaction when hovering links, buttons, and cards.
 * 
 * 4. Performance & Cleanliness:
 *    - 0% CPU/GPU idle sleep loop when fluid evaporates and mouse is still.
 *    - WebGL resources, shaders, framebuffers, and GSAP listeners destroyed on unmount.
 *    - Non-blocking (pointer-events: none).
 */

const CONFIG = {
  radius: 0.015,            // Refined, sleek splat radius (~28-36px soft aura, no giant tube)
  dissipation: 0.895,       // Elegant, fleeting dissipation in ~0.8s (never clutters or blocks reading)
  velocityScale: 1.6,       // Natural, responsive velocity injection
  hazeOpacity: 0.22,        // Soft, ambient, glassy luminescence (100% readable text underneath)
  trackingDuration: 0.12,   // Snappy GSAP tracking (removes the 0.6s rubber-band lag)
};

export default function CloudCursorGSAP() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    // Respect user's accessibility preferences
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas) return;

    // Detect theme attribute from document directly
    const getActiveTheme = () => {
      if (typeof document !== "undefined") {
        const attr = document.documentElement.getAttribute("data-theme");
        if (attr) return attr;
      }
      return themeRef.current || "dark";
    };

    // 1. Initialize WebGL Context
    const gl =
      canvas.getContext("webgl2", { alpha: true, depth: false, antialias: false, powerPreference: "high-performance" }) ||
      canvas.getContext("webgl", { alpha: true, depth: false, antialias: false, powerPreference: "high-performance" });

    if (!gl) return;

    // Detect half-float / float texture format support
    const getTextureFormat = () => {
      if (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext) {
        const ext = gl.getExtension("EXT_color_buffer_float");
        if (ext) {
          return {
            internalFormat: gl.RGBA16F,
            format: gl.RGBA,
            type: gl.HALF_FLOAT,
          };
        }
      }
      const extHalf = gl.getExtension("OES_texture_half_float");
      gl.getExtension("OES_texture_half_float_linear");
      if (extHalf) {
        return {
          internalFormat: gl.RGBA,
          format: gl.RGBA,
          type: extHalf.HALF_FLOAT_OES,
        };
      }
      return {
        internalFormat: gl.RGBA,
        format: gl.RGBA,
        type: gl.UNSIGNED_BYTE,
      };
    };

    const texFormat = getTextureFormat();

    // 2. Vertex & Fragment Shaders
    const baseVertexShader = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;

    // Advection + Diffusion + Dissipation Shader
    const advectFragmentShader = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_source;
      uniform float u_dt;
      uniform float u_dissipation;
      uniform vec2 u_texel;

      void main() {
        vec4 cur = texture2D(u_source, v_uv);
        vec2 vel = cur.xy;

        // Semi-Lagrangian backward advection
        vec2 prevPos = v_uv - vel * u_dt * 0.0008;
        vec4 advected = texture2D(u_source, prevPos);

        // Soft spatial diffusion across 4 neighbors for smooth ethereal feathering
        vec4 left  = texture2D(u_source, v_uv - vec2(u_texel.x, 0.0));
        vec4 right = texture2D(u_source, v_uv + vec2(u_texel.x, 0.0));
        vec4 down  = texture2D(u_source, v_uv - vec2(0.0, u_texel.y));
        vec4 up    = texture2D(u_source, v_uv + vec2(0.0, u_texel.y));
        vec4 diffused = (advected * 2.0 + left + right + down + up) / 6.0;

        // Subtle upward buoyant drift & velocity damping
        vec2 newVel = diffused.xy * (u_dissipation * 0.985);
        newVel.y += 0.00008;
        float newDensity = diffused.z * u_dissipation;

        gl_FragColor = vec4(newVel, newDensity, 1.0);
      }
    `;

    // Gaussian Splat (Velocity + Density Injection) Shader
    const splatFragmentShader = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_target;
      uniform vec2 u_point;
      uniform vec2 u_velocity;
      uniform float u_radius;
      uniform float u_aspect;
      uniform float u_velocityScale;

      void main() {
        vec4 base = texture2D(u_target, v_uv);
        vec2 diff = v_uv - u_point;
        diff.x *= u_aspect;
        float distSq = dot(diff, diff);
        float splat = exp(-distSq / (2.0 * u_radius * u_radius));

        vec2 vel = base.xy + u_velocity * splat * u_velocityScale;
        // Inject density scaled to motion velocity so hovering doesn't pool into an ink puddle
        float velMag = length(u_velocity);
        float injection = splat * clamp(velMag * 0.06 + 0.16, 0.10, 0.30);
        float density = base.z + injection;

        gl_FragColor = vec4(vel, min(density, 1.6), 1.0);
      }
    `;

    // Screen Display Shader
    const displayFragmentShader = `
      precision highp float;
      varying vec2 v_uv;
      uniform sampler2D u_fluid;
      uniform float u_isLight;
      uniform float u_hazeOpacity;

      void main() {
        vec4 fluid = texture2D(u_fluid, v_uv);
        float density = fluid.z;
        vec2 vel = fluid.xy;
        float speed = length(vel);

        if (density < 0.003) {
          discard;
        }

        vec3 finalColor;
        float finalAlpha;

        if (u_isLight > 0.5) {
          // Light Mode: Subtle Warm Champagne Gold & Amber Luminescence
          vec3 goldBase = vec3(0.788, 0.592, 0.227); // #C9973A
          vec3 goldMid  = vec3(0.880, 0.720, 0.380); // Soft Champagne
          vec3 pearl    = vec3(0.960, 0.930, 0.860); // Pearl Aura

          float t = clamp(density * 1.2, 0.0, 1.0);
          vec3 col = mix(goldBase, goldMid, smoothstep(0.0, 0.5, t));
          col = mix(col, pearl, smoothstep(0.45, 0.95, t));

          finalColor = col;
          finalAlpha = smoothstep(0.003, 0.45, density) * (u_hazeOpacity * 0.75);
        } else {
          // Dark Mode: Sophisticated Violet-Indigo & Sky Blue Aura matching portfolio theme
          // No harsh neon pink, no UV blacklight effect, no opaque white slug core
          vec3 brandViolet = vec3(0.486, 0.361, 0.988); // Brand Violet #7c5cfc
          vec3 royalIndigo = vec3(0.388, 0.400, 0.945); // Royal Indigo #6366f1
          vec3 skyGlow     = vec3(0.220, 0.741, 0.973); // Sky Glow #38bdf8

          float t = clamp(density * 1.2, 0.0, 1.0);
          // Shift subtly towards sky blue on rapid flick/motion
          vec3 col = mix(brandViolet, skyGlow, clamp(speed * 0.35, 0.0, 0.65));
          // Core brightens gracefully to royal indigo luminescence (never solid white)
          col = mix(col, royalIndigo, smoothstep(0.15, 0.75, t));

          finalColor = col;
          // Soft Gaussian feathering at edges, silky maximum opacity
          finalAlpha = smoothstep(0.003, 0.5, density) * u_hazeOpacity;
        }

        // Pre-multiplied alpha for silky translucent blending
        gl_FragColor = vec4(finalColor * finalAlpha, finalAlpha);
      }
    `;

    // Compile Shader Helper
    const compileShader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const createProgram = (vsSource, fsSource) => {
      const vs = compileShader(gl.VERTEX_SHADER, vsSource);
      const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
      if (!vs || !fs) return null;
      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(prog));
        return null;
      }
      return prog;
    };

    const advectProg = createProgram(baseVertexShader, advectFragmentShader);
    const splatProg  = createProgram(baseVertexShader, splatFragmentShader);
    const displayProg = createProgram(baseVertexShader, displayFragmentShader);

    if (!advectProg || !splatProg || !displayProg) return;

    // Full-screen Quad Buffer
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const setupQuadAttributes = (prog) => {
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    };

    // 3. Create Double-Buffered Ping-Pong FBOs (512x512)
    const SIM_RES = 512;
    const createFBO = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        texFormat.internalFormat,
        SIM_RES,
        SIM_RES,
        0,
        texFormat.format,
        texFormat.type,
        null
      );

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return { fbo, tex };
    };

    let fboA = createFBO();
    let fboB = createFBO();

    // 4. Viewport & Retina Handling (capped at 2)
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
      canvas.width = Math.floor(screenWidth * dpr);
      canvas.height = Math.floor(screenHeight * dpr);
      canvas.style.width = screenWidth + "px";
      canvas.style.height = screenHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    // 5. GSAP quickTo Smooth Pointer Tracking
    const mousePos = { x: screenWidth * 0.5, y: screenHeight * 0.5 };
    const smoothPos = { x: mousePos.x, y: mousePos.y };

    const quickX = gsap.quickTo(smoothPos, "x", { duration: CONFIG.trackingDuration, ease: "power2.out" });
    const quickY = gsap.quickTo(smoothPos, "y", { duration: CONFIG.trackingDuration, ease: "power2.out" });

    // Custom Cursor DOM tracking
    let cursorQuickX = null;
    let cursorQuickY = null;
    if (cursor) {
      cursorQuickX = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power2.out" });
      cursorQuickY = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power2.out" });
      cursorQuickX(mousePos.x);
      cursorQuickY(mousePos.y);
    }

    let prevPos = { x: mousePos.x, y: mousePos.y };
    let pointerMoved = false;
    let isInteracting = false;
    let lastActiveTime = Date.now();
    let animId = null;
    let isRunning = false;

    // Hover detection for custom cursor scale
    const handleMouseOver = (e) => {
      const target = e.target.closest("a, button, [role='button'], input, textarea, select, .card, .service-card-v2");
      if (target && cursor) {
        gsap.to(cursor, { scale: 1.5, opacity: 0.9, duration: 0.25, ease: "power2.out" });
      } else if (cursor) {
        gsap.to(cursor, { scale: 1, opacity: 0.75, duration: 0.25, ease: "power2.out" });
      }
    };
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    const onPointerMove = (clientX, clientY) => {
      mousePos.x = clientX;
      mousePos.y = clientY;
      quickX(clientX);
      quickY(clientY);

      if (cursorQuickX && cursorQuickY) {
        cursorQuickX(clientX);
        cursorQuickY(clientY);
        if (cursor && cursor.style.opacity === "0") {
          cursor.style.opacity = "1";
        }
      }

      pointerMoved = true;
      lastActiveTime = Date.now();
      startLoop();
    };

    const handleMouseMove = (e) => onPointerMove(e.clientX, e.clientY);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handlePointerLeave = () => {
      if (cursor) cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      themeRef.current = getActiveTheme();
      startLoop();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 6. Fluid Simulation Tick
    let lastFrameTime = performance.now();

    const render = (time) => {
      const dt = Math.min((time - lastFrameTime) * 0.001, 0.033);
      lastFrameTime = time;

      const aspect = screenWidth / Math.max(screenHeight, 1);

      // Compute velocity delta from smoothed cursor
      const dx = (smoothPos.x - prevPos.x) / Math.max(screenWidth, 1);
      const dy = (smoothPos.y - prevPos.y) / Math.max(screenHeight, 1);
      prevPos.x = smoothPos.x;
      prevPos.y = smoothPos.y;

      const speed = Math.hypot(dx, dy);

      // A. Advection Pass (fboA -> fboB)
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fbo);
      gl.viewport(0, 0, SIM_RES, SIM_RES);
      gl.useProgram(advectProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
      gl.uniform1i(gl.getUniformLocation(advectProg, "u_source"), 0);
      gl.uniform1f(gl.getUniformLocation(advectProg, "u_dt"), dt * 60.0);
      gl.uniform1f(gl.getUniformLocation(advectProg, "u_dissipation"), CONFIG.dissipation);
      gl.uniform2f(gl.getUniformLocation(advectProg, "u_texel"), 1.0 / SIM_RES, 1.0 / SIM_RES);

      setupQuadAttributes(advectProg);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Swap FBOs
      let temp = fboA;
      fboA = fboB;
      fboB = temp;

      // B. Gaussian Splat Pass (Inject mouse velocity + smoke density into fboB)
      if (speed > 0.0001 || pointerMoved) {
        pointerMoved = false;

        gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.fbo);
        gl.viewport(0, 0, SIM_RES, SIM_RES);
        gl.useProgram(splatProg);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
        gl.uniform1i(gl.getUniformLocation(splatProg, "u_target"), 0);

        // UV position in 0..1 coordinates (WebGL Y is flipped from DOM Y)
        const uvX = smoothPos.x / screenWidth;
        const uvY = 1.0 - smoothPos.y / screenHeight;

        gl.uniform2f(gl.getUniformLocation(splatProg, "u_point"), uvX, uvY);
        gl.uniform2f(gl.getUniformLocation(splatProg, "u_velocity"), dx * 25.0, -dy * 25.0);
        gl.uniform1f(gl.getUniformLocation(splatProg, "u_radius"), CONFIG.radius);
        gl.uniform1f(gl.getUniformLocation(splatProg, "u_aspect"), aspect);
        gl.uniform1f(gl.getUniformLocation(splatProg, "u_velocityScale"), CONFIG.velocityScale);

        setupQuadAttributes(splatProg);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // Swap after splat
        temp = fboA;
        fboA = fboB;
        fboB = temp;
      }

      // C. Fullscreen Display Pass (fboA -> screen canvas)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // Pre-multiplied alpha

      gl.useProgram(displayProg);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fboA.tex);
      gl.uniform1i(gl.getUniformLocation(displayProg, "u_fluid"), 0);
      gl.uniform1f(gl.getUniformLocation(displayProg, "u_isLight"), getActiveTheme() === "light" ? 1.0 : 0.0);
      gl.uniform1f(gl.getUniformLocation(displayProg, "u_hazeOpacity"), CONFIG.hazeOpacity);

      setupQuadAttributes(displayProg);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      gl.disable(gl.BLEND);

      // Idle sleep: if idle for >1.4s, stop render loop to save 100% GPU cycles
      const idleTime = Date.now() - lastActiveTime;
      if (idleTime < 1400) {
        animId = requestAnimationFrame(render);
      } else {
        isRunning = false;
        animId = null;
      }
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        lastFrameTime = performance.now();
        animId = requestAnimationFrame(render);
      }
    };
    startLoop();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handlePointerLeave);
      observer.disconnect();

      if (animId) cancelAnimationFrame(animId);

      // Clean up WebGL resources
      if (fboA) { gl.deleteFramebuffer(fboA.fbo); gl.deleteTexture(fboA.tex); }
      if (fboB) { gl.deleteFramebuffer(fboB.fbo); gl.deleteTexture(fboB.tex); }
      gl.deleteBuffer(quadBuffer);
      gl.deleteProgram(advectProg);
      gl.deleteProgram(splatProg);
      gl.deleteProgram(displayProg);
    };
  }, []);

  const isLight = theme === "light";

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9998,
          mixBlendMode: isLight ? "normal" : "screen",
        }}
      />
      {/* Interactive Custom Cursor Ring */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 12,
          height: 12,
          marginLeft: -6,
          marginTop: -6,
          borderRadius: "50%",
          border: "1.5px solid var(--accent)",
          background: "rgba(var(--accent-rgb), 0.12)",
          boxShadow: "0 0 8px rgba(var(--accent-rgb), 0.3)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: 0,
          transform: "scale(1)",
          willChange: "transform, opacity",
          transition: "opacity 0.25s ease",
        }}
      />
    </>
  );
}
