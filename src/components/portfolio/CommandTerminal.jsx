import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Mail, ArrowUpRight, MessageSquare } from "lucide-react";

const LOGS = [
{ time: "03:42:11", type: "COMMIT", msg: "feat(economy): atomic ledger transactions, 0.2ms tick impact" },
{ time: "02:18:47", type: "COMMIT", msg: "fix(modshield): reduce false-positive threshold to 0.92" },
{ time: "01:55:03", type: "DEPLOY", msg: "prod // event-orchestrator v2.6 → 4 regions live" },
{ time: "23:41:22", type: "COMMIT", msg: "perf(profiler): sampling overhead <0.05ms per chunk" },
{ time: "22:09:15", type: "MERGE", msg: "main ← redstone-router, 0% signal loss verified" }];


const typeColor = {
  COMMIT: "text-redstone",
  DEPLOY: "text-violet",
  MERGE: "text-iron"
};

export default function CommandTerminal() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= LOGS.length) return;
    const id = setTimeout(() => setVisible((v) => v + 1), 280);
    return () => clearTimeout(id);
  }, [visible]);

  return (
    <footer id="command-terminal" className="relative bg-void px-6 pb-12 pt-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col items-start gap-6 border-l-2 border-redstone pl-6">
          
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-redstone">view 04 // the command terminal</span>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-iron md:text-6xl">
            Open a ticket
          </h2>
          <p className="max-w-xl font-body text-base leading-relaxed text-tungsten md:text-lg">Looking for a systems engineer who has shipped to 1.5k+ players or a staff lead who has run the floor? Let's build the next realm.


          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://discord.gg/6PpZfCVDjy"
              target="_blank"
              rel="noreferrer"
              className="focus-ring group flex items-center gap-3 rounded-sm border border-redstone bg-redstone px-6 py-4 font-mono text-sm font-semibold uppercase tracking-widest text-void transition-transform hover:scale-[1.03]">
              
              <MessageSquare className="h-5 w-5" />
              DISCORD SERVER
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="https://discord.com/channels/@me"
              className="focus-ring group flex items-center gap-3 border border-border bg-bedrock px-6 py-4 font-mono text-sm font-semibold uppercase tracking-widest text-iron transition-colors hover:border-redstone/60 rounded-sm">
              
              <MessageSquare className="h-5 w-5 text-redstone" />
              CONTACT : kayghostytb @ discord
            </a>
          </div>
        </motion.div>

        {/* base bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-tungsten/60 sm:flex-row">
          <span>© 2026 // voxel architect codex</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-redstone animate-torch" />
            built with structural syntax
          </span>
          <span>uptime: 99.98%</span>
          <Link to="/admin/servers" className="focus-ring transition-colors hover:text-redstone">› manage servers</Link>
        </div>
      </div>
    </footer>);

}