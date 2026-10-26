"use client";

import { useState, useEffect } from "react";
import {
  SiReact,
  SiTypescript,
  SiJavascript,
  SiNextdotjs,
  SiHtml5,
  SiCss,
  SiTailwindcss,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiGithub,
  SiPostman,
  SiPython,
  SiLinux,
  SiRedux,
  SiGraphql,
  SiFirebase,
  SiMysql,
  SiNestjs,
  SiKubernetes,
  SiFigma,
  SiSupabase,
} from "react-icons/si";
import { FaAws } from "react-icons/fa";
import { RiCodeBoxLine } from "react-icons/ri";

const BRAND_ICONS = [
  { match: /react native/i, icon: SiReact, color: "#61dafb" },
  { match: /react/i, icon: SiReact, color: "#61dafb" },
  { match: /typescript|ts/i, icon: SiTypescript, color: "#3178c6" },
  { match: /javascript|js/i, icon: SiJavascript, color: "#f7df1e" },
  { match: /next/i, icon: SiNextdotjs, color: "var(--text-primary)" },
  { match: /html/i, icon: SiHtml5, color: "#e34f26" },
  { match: /css/i, icon: SiCss, color: "#1572b6" },
  { match: /tailwind/i, icon: SiTailwindcss, color: "#06b6d4" },
  { match: /node/i, icon: SiNodedotjs, color: "#5fa04e" },
  { match: /express/i, icon: SiExpress, color: "var(--text-primary)" },
  { match: /mongo/i, icon: SiMongodb, color: "#47a248" },
  { match: /postgres/i, icon: SiPostgresql, color: "#4169e1" },
  { match: /mysql/i, icon: SiMysql, color: "#4479a1" },
  { match: /supabase/i, icon: SiSupabase, color: "#3ecf8e" },
  { match: /docker/i, icon: SiDocker, color: "#2496ed" },
  { match: /git\b|version control/i, icon: SiGit, color: "#f05032" },
  { match: /github/i, icon: SiGithub, color: "var(--text-primary)" },
  { match: /postman/i, icon: SiPostman, color: "#ff6c37" },
  { match: /python/i, icon: SiPython, color: "#3776ab" },
  { match: /aws|amazon/i, icon: FaAws, color: "#ff9900" },
  { match: /linux|ubuntu/i, icon: SiLinux, color: "#fcc624" },
  { match: /redux/i, icon: SiRedux, color: "#764abc" },
  { match: /graphql/i, icon: SiGraphql, color: "#e10098" },
  { match: /firebase/i, icon: SiFirebase, color: "#ffca28" },
  { match: /nest/i, icon: SiNestjs, color: "#ea2845" },
  { match: /kubernetes|k8s/i, icon: SiKubernetes, color: "#326ce5" },
  { match: /figma/i, icon: SiFigma, color: "#f24e1e" },
];

export default function SkillLogo({ image, name = "", size = 36, style = {} }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [image]);

  if (image && !imgError) {
    return (
      <img
        src={image}
        alt={name}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // Look for brand icon match by skill name
  const match = BRAND_ICONS.find((b) => b.match.test(name));
  if (match) {
    const IconComponent = match.icon;
    return (
      <IconComponent
        style={{
          width: size,
          height: size,
          color: match.color,
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  // Generic clean fallback
  return (
    <RiCodeBoxLine
      style={{
        width: size,
        height: size,
        color: "var(--accent)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}
