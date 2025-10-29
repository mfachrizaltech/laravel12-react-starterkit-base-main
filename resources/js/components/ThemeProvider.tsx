// src/components/ThemeProvider.tsx
import React, { useEffect } from "react";
import { useAppearance } from "@/hooks/use-appearance";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { appearance } = useAppearance();

  // resolve final dark/light based on "system" or explicit setting
  const isDark =
    appearance === "dark" ||
    (appearance === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  useEffect(() => {
    const linkId = "prime-theme";
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    } 
    // Apply PrimeReact theme based on appearance
    link.href = isDark
      ? "https://unpkg.com/primereact/resources/themes/lara-dark-cyan/theme.css"
      : "https://unpkg.com/primereact/resources/themes/lara-light-cyan/theme.css";
  }, [isDark]);

  return <>{children}</>;
}
