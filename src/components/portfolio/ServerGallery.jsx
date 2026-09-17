import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image } from "@/components/ui/image";
import { X, ChevronLeft, ChevronRight, Server as ServerIcon } from "lucide-react";
import projectsData from "../../data/projects.json";

function serverImages(s) {
  const list = [];
  if (s.image_url) list.push(s.image_url);
  if (s.images) {
    s.images.split("\n").map((u) => u.trim()).filter(Boolean).forEach((u) => {
      if (!list.includes(u)) list.push(u);
    });
  }
  return list;
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-tungsten/60">{label}</div>
      <div className="font-mono text-sm font-semibold text-iron">{value}</div>
    </div>
  );
}

function ServerCard({ server, index, onOpen }) {
  const extraCount = serverImages(server).length - 1;
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={onOpen}
      className="focus-ring group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-sm border border-border bg-bedrock text-left transition-colors hover:border-redstone/60"
    >
      {server.image_url ? (
        <Image src={server.image_url} alt={server.name} className="absolute inset-0 h-full w-full object-cover opacity-65 transition-all duration-500 group-hover:scale-105 group-hover:opacity-80" fittingType="fill" />
      ) : (
        <div className="absolute inset-0 grid-chunks opacity-40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/40 to-transparent" />
      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2">
          {server.version && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-redstone">{server.version}</span>}
          {extraCount > 0 && <span className="rounded-sm border border-border bg-void/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-tungsten">+{extraCount} photos</span>}
        </div>
        <h3 className="mt-1 font-heading text-xl font-bold text-iron">{server.name}</h3>
        {server.role && <p className="font-mono text-[11px] uppercase tracking-widest text-tungsten">{server.role}</p>}
      </div>
    </motion.button>
  );
}

export default function ServerGallery() {
  const servers = [...projectsData].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(null); 
  const [imgIndex, setImgIndex] = useState(0);

  const visible = servers.slice(0, 3);
  const hiddenCount = Math.max(servers.length - 3, 0);

  const openLightbox = (index) => { setActive(index); setImgIndex(0); };
  const closeLightbox = () => setActive(null);

  const activeServer = active !== null ? servers[active] : null;
  const activeImages = activeServer ? serverImages(activeServer) : [];

  const next = useCallback(() => { setImgIndex((i) => (activeImages.length <= 1 ? 0 : (i + 1) % activeImages.length)); }, [activeImages.length]);
  const prev = useCallback(() => { setImgIndex((i) => (activeImages.length <= 1 ? 0 : (i - 1 + activeImages.length) % activeImages.length)); }, [activeImages.length]);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev]);

  const currentImage = activeImages[imgIndex] || activeImages;

  return (
    <section id="server-registry" className="relative bg-void px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 flex flex-col gap-4 border-l-2 border-redstone pl-6"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-redstone">registry // worlds orchestrated</span>
          <h2 className="font-heading text-4xl font-bold tracking-tight text-iron md:text-6xl">Server Registry</h2>
        </motion.div>

        {servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-24 text-center">
            <ServerIcon className="mb-4 h-10 w-10 text-tungsten/40" /><p className="font-mono text-sm uppercase tracking-widest text-tungsten">no servers registered</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((s, i) => <ServerCard key={s.id || i} server={s} index={i} onOpen={() => openLightbox(i)} />)}
            {hiddenCount > 0 && (
              <button onClick={() => openLightbox(3)} className="focus-ring group relative flex min-h-[280px] flex-col items-center justify-center overflow-hidden rounded-sm border border-border bg-bedrock">
                <div className="absolute inset-0 bg-void/70" />
                <div className="relative z-10 flex flex-col items-center"><span className="font-heading text-5xl font-bold text-redstone redstone-text-glow md:text-6xl">+{servers.length - 3}</span><span className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-tungsten">more worlds</span></div>
              </button>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeServer && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeLightbox} className="fixed inset-0 z-50 flex items-center justify-center bg-void/90 p-4 backdrop-blur-sm md:p-8">
            <button onClick={closeLightbox} className="focus-ring absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-bedrock text-tungsten hover:text-redstone"><X className="h-5 w-5" /></button>
            {activeImages.length > 1 && (
              <><button onClick={(e) => { e.stopPropagation(); prev(); }} className="focus-ring absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-bedrock/80 text-iron hover:border-redstone md:left-6"><ChevronLeft className="h-6 w-6" /></button>
              <button onClick={(e) => { e.stopPropagation(); next(); }} className="focus-ring absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-sm border border-border bg-bedrock/80 text-iron hover:border-redstone md:right-6"><ChevronRight className="h-6 w-6" /></button></>
            )}
            <motion.div key={activeServer.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="flex w-full max-w-5xl flex-col overflow-hidden rounded-sm border border-border bg-bedrock shadow-2xl">
              <div className="relative aspect-video w-full overflow-hidden bg-void">
                {currentImage ? <Image src={currentImage} alt={activeServer.name} className="h-full w-full object-cover" fittingType="fill" /> : <div className="grid-chunks absolute inset-0 opacity-40" />}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bedrock to-transparent p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    {activeImages.length > 0 && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-redstone">{String(imgIndex + 1).padStart(2, "0")} / {String(activeImages.length).padStart(2, "0")}</span>}
                    {activeServer.version && <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-tungsten/70">{activeServer.version}</span>}
                  </div>
                  <h3 className="mt-1 font-heading text-2xl font-bold text-iron md:text-3xl">{activeServer.name}</h3>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3 bg-bedrock">
                <div className="md:col-span-2">
                  {activeServer.description && <p className="font-body text-sm leading-relaxed text-tungsten">{activeServer.description}</p>}
                  {activeServer.tags && <div className="mt-4 flex flex-wrap gap-2">{activeServer.tags.split(",").map((t) => t.trim()).filter(Boolean).map((t) => <span key={t} className="rounded-sm border border-border bg-void px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-tungsten">{t}</span>)}</div>}
                </div>
                <div className="flex flex-col gap-3 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                  {activeServer.role && <Detail label="role" value={activeServer.role} />}
                  {activeServer.players && <Detail label="players" value={activeServer.players} />}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
