import React, { useEffect, useState } from "react";
import { Code2, BarChart3, Link2, Server, Home } from "lucide-react";

const SLOTS = [
  { id: "monolith", label: "Top", icon: Home },
  { id: "server-registry", label: "Worlds", icon: Server },
  { id: "logic-engine", label: "Code", icon: Code2 },
  { id: "social-equilibrium", label: "Impact", icon: BarChart3 },
  { id: "command-terminal", label: "Connect", icon: Link2 },
];

export default function Hotbar() {
  const [active, setActive] = useState("monolith");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    SLOTS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1.5 rounded-sm border border-border bg-bedrock/90 p-1.5 backdrop-blur-md redstone-glow">
        {SLOTS.map((slot) => {
          const Icon = slot.icon;
          const isActive = active === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => scrollTo(slot.id)}
              aria-label={slot.label}
              aria-current={isActive ? "true" : undefined}
              className={`focus-ring group flex h-12 w-12 flex-col items-center justify-center rounded-sm border transition-all md:h-14 md:w-20 md:flex-row md:gap-2 md:px-3 ${
                isActive
                  ? "border-redstone bg-void text-redstone"
                  : "border-transparent text-tungsten hover:border-border hover:text-iron"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] md:inline">
                {slot.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}