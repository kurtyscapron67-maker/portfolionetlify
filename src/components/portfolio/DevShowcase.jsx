import React, { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Terminal } from "lucide-react";
import { getIcon } from "@/lib/iconMap";
// Importation directe de vos données JSON locales
import serversData from "../../data/servers.json";

function parseMetrics(raw) {
  if (!raw) return [];
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return { value: line.trim(), label: "" };
      return { value: line.slice(0, idx).trim(), label: line.slice(idx + 1).trim() };
    })
    .filter((m) => m.value || m.label);
}

function CodeBlock({ code }) {
  return (
    <pre className="overflow-x-auto rounded-sm border border-border bg-void/80 p-4 font-mono text-[12px] leading-relaxed text-tungsten">
      <code>
        {code.split("\n").map((line, i) => {
          const isComment = line.trim().startsWith("#");
          return (
            <div key={i} className="flex">
              <span className="mr-4 w-6 shrink-0 text-right text-tungsten/40">{(i + 1).toString().padStart(2, "0")}</span>
              <span className={`whitespace-pre ${isComment ? "text-tungsten/50 italic" : ""}`}>{line || " "}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}

function ProjectCard({ project, index }) {
  const [wireframe, setWireframe] = useState(false);
  const Icon = getIcon(project.icon);
  const metrics = parseMetrics(project.metrics);

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setWireframe(true)}
      onMouseLeave={() => setWireframe(false)}
      className={`group relative flex flex-col overflow-hidden rounded-sm border border-border bg-bedrock p-6 transition-colors hover:border-redstone/60 focus-ring ${project.span ?? "md:col-span-2"}`}
    >
      {/* header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-void text-redstone transition-transform group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-heading text-xl font-semibold text-iron">{project.title}</h3>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-tungsten/70">{project.tag}</p>
          </div>
        </div>
        <span className={`font-mono text-[10px] uppercase tracking-widest transition-colors ${wireframe ? "text-redstone" : "text-tungsten/40"}`}>
          {wireframe ? "wireframe.on" : "wireframe.off"}
        </span>
      </div>

      <p className="mb-5 font-body text-sm leading-relaxed text-tungsten">{project.description}</p>

      {/* metrics */}
      {metrics.length > 0 && (
        <div className="mb-5 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3">
          {metrics.map((m, i) => (
            <div key={i} className="bg-bedrock px-3 py-3">
              <div className="font-mono text-lg font-bold text-iron">{m.value}</div>
              <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-tungsten/60">{m.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* image (only featured project) */}
      {project.image_url && (
        <div className="relative mb-5 overflow-hidden rounded-sm border border-border">
          <Image
            src={project.image_url}
            alt={`${project.title} — macro render`}
            className={`h-40 w-full object-cover transition-all duration-500 ${wireframe ? "scale-105 saturate-150" : "saturate-50"}`}
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bedrock via-transparent to-transparent" />
          {wireframe && (
            <div className="absolute inset-0 grid-chunks opacity-40 mix-blend-screen" />
          )}
        </div>
      )}

      {/* code snippet */}
      <div className="mt-auto">
        <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-tungsten/60">
          <Terminal className="h-3 w-3 text-redstone" /> logic.extract
        </div>
        <CodeBlock code={project.snippet || ""} />
      </div>

      {/* redstone trace line on hover */}
      <span className="pointer-events-none absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-redstone to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.article>
  );
}

export default function DevShowcase() {
  // Tri automatique des données selon le champ "order" défini dans votre JSON
  const projects = [...serversData].sort((a, b) => a.order - b.order);

  return (
    <section id="logic-engine" className="relative bg-void px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col gap-4 border-l-2 border-redstone pl-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-redstone">view 02 // the logic engine</span>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-iron md:text-6xl">
            Dev Showcase
          </h2>
          <p className="max-w-2xl font-body text-base leading-relaxed text-tungsten md:text-lg">
            Skript systems and plugin configurations, not black-box claims. Each block exposes the
            internals — metrics, snippets, and the wiring that makes it run.
          </p>
        </motion.div>

        {/* bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:auto-rows-auto">
          {projects.length === 0 ? (
            <p className="col-span-full rounded-sm border border-dashed border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-tungsten/70">
              no projects published yet
            </p>
          ) : (
            projects.map((p, i) => (
              <ProjectCard key={p.id || i} project={p} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
