import React from "react";
import { motion } from "framer-motion";
import { getIcon } from "@/lib/iconMap";
// Importation directe de vos données JSON locales
import metricsData from "../../data/metrics.json";

function MetricCell({ metric, index }) {
  const Icon = getIcon(metric.icon);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col gap-3 rounded-sm border border-border bg-bedrock p-6 transition-colors hover:border-redstone/50 focus-ring"
    >
      <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-redstone animate-torch" />
      <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-border bg-void text-redstone">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="font-heading text-4xl font-bold text-iron md:text-5xl">{metric.value}</div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-redstone">{metric.label}</div>
      </div>
      <p className="font-body text-sm leading-relaxed text-tungsten">{metric.note}</p>
    </motion.div>
  );
}

export default function StaffImpact() {
  // Tri automatique des données selon le champ "order" défini dans votre JSON
  const metrics = [...metricsData].sort((a, b) => a.order - b.order);

  return (
    <section id="social-equilibrium" className="relative bg-bedrock px-6 py-24 md:px-12 md:py-32">
      <div className="absolute inset-0 grid-chunks opacity-50" />
      <div className="relative mx-auto max-w-7xl">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col gap-4 border-l-2 border-redstone pl-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-redstone">view 03 // the social equilibrium</span>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-iron md:text-6xl">
            Staff Impact
          </h2>
          <p className="max-w-2xl font-body text-base leading-relaxed text-tungsten md:text-lg">
            Management and moderation measured, not narrated. Each cell pulses like a redstone torch —
            proof of work, not promises.
          </p>
        </motion.div>

        {/* metric grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.length === 0 ? (
            <p className="col-span-full rounded-sm border border-dashed border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-tungsten/70">
              no metrics published yet
            </p>
          ) : (
            metrics.map((m, i) => (
              <MetricCell key={m.id || i} metric={m} index={i} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
