import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, Upload, Loader2, Plus, Code2 } from "lucide-react";
import { ICON_NAMES, getIcon } from "@/lib/iconMap";

const SPAN_OPTIONS = [
  { value: "md:col-span-2", label: "Small (2 cols)" },
  { value: "md:col-span-3", label: "Wide (3 cols)" },
  { value: "md:col-span-3 md:row-span-2", label: "Featured (3×2)" },
];

const EMPTY = {
  title: "",
  tag: "",
  icon: "Boxes",
  description: "",
  snippet: "",
  image_url: "",
  span: "md:col-span-2",
  metrics: "",
  order: 0,
};

export default function ProjectsManager() {
  const [projects, setProjects] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await base44.entities.Project.list("order", 100);
      setProjects(data);
    } catch (e) {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, image_url: file_url }));
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Project title is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await base44.entities.Project.update(editingId, payload);
      } else {
        await base44.entities.Project.create(payload);
      }
      reset();
      await load();
    } catch (err) {
      setError("Could not save. Check your fields and retry.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title ?? "",
      tag: p.tag ?? "",
      icon: p.icon ?? "Boxes",
      description: p.description ?? "",
      snippet: p.snippet ?? "",
      image_url: p.image_url ?? "",
      span: p.span ?? "md:col-span-2",
      metrics: p.metrics ?? "",
      order: p.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.title}"?`)) return;
    try {
      await base44.entities.Project.delete(p.id);
      await load();
    } catch (err) {
      setError("Could not delete project.");
    }
  };

  const selectClass =
    "flex h-10 w-full rounded-md border border-input bg-void px-3 py-2 text-sm text-iron focus-ring";

  return (
    <>
      {/* form */}
      <div className="mb-12 rounded-sm border border-border bg-bedrock p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-void text-redstone">
            <Code2 className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-iron">
            {editingId ? "Edit Project" : "Add Project"}
          </h1>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field full>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={form.title} onChange={set("title")} placeholder="Economy Core" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="tag">Tag</Label>
            <Input id="tag" value={form.tag} onChange={set("tag")} placeholder="skript // .sk" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="icon">Icon</Label>
            <select id="icon" value={form.icon} onChange={set("icon")} className={selectClass}>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          <Field full>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={set("description")} placeholder="What the system does, tech, scale…" className="bg-void border-border min-h-[80px]" />
          </Field>

          <Field full>
            <Label htmlFor="snippet">Code snippet</Label>
            <Textarea id="snippet" value={form.snippet} onChange={set("snippet")} placeholder={"on right click on villager:\n    ..."} className="bg-void border-border min-h-[140px] font-mono text-xs" />
          </Field>

          <Field>
            <Label htmlFor="span">Grid size</Label>
            <select id="span" value={form.span} onChange={set("span")} className={selectClass}>
              {SPAN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          <Field>
            <Label htmlFor="order">Display order</Label>
            <Input id="order" type="number" value={form.order} onChange={set("order")} placeholder="0" className="bg-void border-border" />
          </Field>

          <Field full>
            <Label htmlFor="metrics">Metrics (one per line: value | label)</Label>
            <Textarea id="metrics" value={form.metrics} onChange={set("metrics")} placeholder={"9,200 | lines of code\n0.2ms | tick impact"} className="bg-void border-border min-h-[80px] font-mono text-xs" />
          </Field>

          <Field full>
            <Label>Image (optional, featured only)</Label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <label className="focus-ring group flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed border-border bg-void transition-colors hover:border-redstone/60 sm:w-52">
                {form.image_url ? (
                  <Image src={form.image_url} alt="preview" className="h-full w-full object-cover" fittingType="fill" />
                ) : (
                  <>
                    {uploading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-redstone" />
                    ) : (
                      <Upload className="h-6 w-6 text-tungsten" />
                    )}
                    <span className="font-mono text-[10px] uppercase tracking-widest text-tungsten">
                      {uploading ? "uploading…" : "click to upload"}
                    </span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
              </label>
              {form.image_url && (
                <Input value={form.image_url} onChange={set("image_url")} className="bg-void border-border" placeholder="or paste an image URL" />
              )}
            </div>
          </Field>

          {error && (
            <p className="md:col-span-2 font-mono text-sm text-redstone">
              <span className="text-redstone">›</span> {error}
            </p>
          )}

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving || uploading} className="focus-ring gap-2 rounded-sm border border-redstone bg-redstone font-mono text-xs uppercase tracking-widest text-void hover:bg-redstone/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Save changes" : "Add project"}
            </Button>
            {editingId && (
              <Button type="button" onClick={reset} variant="ghost" className="focus-ring gap-2 rounded-sm border border-border bg-transparent font-mono text-xs uppercase tracking-widest text-tungsten hover:text-iron">
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* list */}
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-iron">Registered projects</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-tungsten">
          {projects === null ? "…" : `${projects.length} total`}
        </span>
      </div>

      {projects === null ? (
        <div className="mt-6 flex items-center justify-center py-12 text-tungsten">
          <Loader2 className="h-5 w-5 animate-spin text-redstone" />
        </div>
      ) : projects.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-tungsten/70">
          no projects yet — add your first above
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {projects.map((p) => {
            const Icon = getIcon(p.icon);
            return (
              <div key={p.id} className="flex items-center gap-4 rounded-sm border border-border bg-bedrock p-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-void text-redstone">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-heading text-sm font-semibold text-iron">{p.title}</span>
                    {p.tag && <span className="font-mono text-[10px] uppercase tracking-widest text-tungsten/60">{p.tag}</span>}
                  </div>
                  {p.description && <span className="line-clamp-1 font-mono text-[11px] uppercase tracking-widest text-tungsten">{p.description}</span>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => edit(p)} aria-label="Edit" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(p)} aria-label="Delete" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

function Field({ children, full }) {
  return <div className={full ? "md:col-span-2" : ""}>{children}</div>;
}