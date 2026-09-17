import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Image } from "@/components/ui/image";

export default function Hero({ heroImage }) {
  const { scrollYProgress } = useScroll();
  const yText = useTransform(scrollYProgress, [0, 0.25], [0, -120]);
  const yImage = useTransform(scrollYProgress, [0, 0.25], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [coords, setCoords] = useState("0, 0, 0");
  useEffect(() => {
    const id = setInterval(() => {
      const x = (Math.floor(Math.random() * 999)).toString().padStart(3, "0");
      const y = (Math.floor(Math.random() * 999)).toString().padStart(3, "0");
      const z = (Math.floor(Math.random() * 399) - 200).toString();
      setCoords(`${x}, ${y}, ${z}`);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="monolith" className="relative min-h-screen w-full overflow-hidden bg-void grid-chunks">
      {/* Parallax macro render */}
      <motion.div style={{ y: yImage, opacity }} className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="Hyper-detailed redstone repeater macro render"
          className="h-full w-full object-cover opacity-40"
          fittingType="fill"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-void/70 to-void" />
        <div className="absolute inset-0 bg-gradient-to-r from-void/80 via-transparent to-void/80" />
      </motion.div>

      {/* Top status bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-tungsten md:px-12">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 bg-redstone animate-torch" />
          server.online
        </span>
        <span className="hidden md:inline">voxel-architect // codex v2.6</span>
        <span>tick: 20.0 tps</span>
      </div>

      {/* Vertically stacked titles */}
      <motion.div style={{ y: yText }} className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-redstone"
        >
          [ digital codex // master builder of virtual realms ]
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[14vw] font-bold leading-[0.85] tracking-tight text-iron md:text-[8vw]"
        >
          STAFF
          <br />
          ARCHITECT
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="my-4 h-px w-40 origin-center bg-redstone md:w-64"
        />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading text-[10vw] font-semibold leading-[0.85] tracking-tight text-tungsten md:text-[5vw]"
        >
          LEAD DEVELOPER
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-10 max-w-xl font-body text-base leading-relaxed text-tungsten md:text-lg"
        >
          Engineering the gravity of code and the architecture of virtual societies —
          plugins, moderation systems, and community orchestration for high-performance Minecraft realms.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mt-12 flex flex-col items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-tungsten/70"
        >
          <span>scroll to generate world</span>
          <span className="h-10 w-px bg-gradient-to-b from-redstone to-transparent" />
        </motion.div>
      </motion.div>

      {/* Coordinate readout */}
      <div className="absolute bottom-6 left-6 z-20 font-mono text-[11px] text-tungsten/70 md:left-12">
        <span className="text-redstone">›</span> pos: {coords}
      </div>
      <div className="absolute bottom-6 right-6 z-20 font-mono text-[11px] text-tungsten/70 md:right-12">
        seed: 4829107
      </div>
    </section>
  );
}