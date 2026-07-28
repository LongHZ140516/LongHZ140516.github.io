import { useState } from "react";
import {
  List,
  Moon,
  Sun,
  X,
} from "@phosphor-icons/react";
import { initialsForName } from "../content/contentUtils";
import type { Theme } from "../content/types";

const navigation = [
  { label: "Publications", href: "#publications" },
  { label: "Projects", href: "#projects" },
  { label: "Interests", href: "#interests" },
  { label: "About", href: "#about" },
];

function getInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    const savedTheme = document.documentElement.dataset.theme;

    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
  }

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
}

export function SiteHeader({ name }: { name: string }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    setTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch {
      // The chosen theme still applies when storage is unavailable.
    }
  };

  return (
    <header className="site-header">
      <a className="brand-mark" href="#about" aria-label={`${name}, home`}>
        <span className="brand-monogram" aria-hidden="true">
          {initialsForName(name)}
        </span>
        <span className="brand-name">{name}</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button
          className="icon-button"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? (
            <Moon size={19} weight="regular" aria-hidden="true" />
          ) : (
            <Sun size={19} weight="regular" aria-hidden="true" />
          )}
        </button>
        <button
          className="icon-button menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? (
            <X size={20} weight="regular" aria-hidden="true" />
          ) : (
            <List size={20} weight="regular" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav${menuOpen ? " mobile-nav--open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
