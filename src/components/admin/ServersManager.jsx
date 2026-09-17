import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Image } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, Upload, Loader2, Plus, Server as ServerIcon } from "lucide-react";

const EMPTY = {
  name: "",
  description: "",
  image_url: "",
  role: "",
  players: "",
  version: "",
  tags: "",
  images: "",
  order: 0,
};

export default function ServersManager() {
  const [servers, setServers] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await base44.entities.Server.list("order", 100);
      setServers(data);
    } catch (e) {
      setServers([]);
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

  const imagesList = form.images
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const onUploadExtra = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingExtra(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm((f) => ({ ...f, images: (f.images ? f.images + "\n" : "") + file_url }));
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploadingExtra(false);
    }
  };

  const removeImage = (idx) => {
    setForm((f) => ({
      ...f,
      images: imagesList.filter((_, i) => i !== idx).join("\n"),
    }));
  };

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Server name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await base44.entities.Server.update(editingId, payload);
      } else {
        await base44.entities.Server.create(payload);
      }
      reset();
      await load();
    } catch (err) {
      setError("Could not save. Check your fields and retry.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (s) => {
    setEditingId(s.id);
    setForm({
      name: s.name ?? "",
      description: s.description ?? "",
      image_url: s.image_url ?? "",
      role: s.role ?? "",
      players: s.players ?? "",
      version: s.version ?? "",
      tags: s.tags ?? "",
      images: s.images ?? "",
      order: s.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"?`)) return;
    try {
      await base44.entities.Server.delete(s.id);
      await load();
    } catch (err) {
      setError("Could not delete server.");
    }
  };

  return (
    <>
      {/* form */}
      <div className="mb-12 rounded-sm border border-border bg-bedrock p-6 md:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-sm border border-border bg-void text-redstone">
            <ServerIcon className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-iron">
            {editingId ? "Edit Server" : "Add Server"}
          </h1>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field full>
            <Label htmlFor="name">Server name *</Label>
            <Input id="name" value={form.name} onChange={set("name")} placeholder="Hyperion SMP" className="bg-void border-border" />
          </Field>

          <Field full>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={form.description} onChange={set("description")} placeholder="What you did: Skript systems, plugin config, staff role…" className="bg-void border-border min-h-[90px]" />
          </Field>

          <Field>
            <Label htmlFor="role">Your role</Label>
            <Input id="role" value={form.role} onChange={set("role")} placeholder="Lead Developer" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="players">Players</Label>
            <Input id="players" value={form.players} onChange={set("players")} placeholder="40k+" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="version">Version / stack</Label>
            <Input id="version" value={form.version} onChange={set("version")} placeholder="Paper 1.20.4" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="order">Display order</Label>
            <Input id="order" type="number" value={form.order} onChange={set("order")} placeholder="0" className="bg-void border-border" />
          </Field>

          <Field full>
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={form.tags} onChange={set("tags")} placeholder="skript, plugins, economy" className="bg-void border-border" />
          </Field>

          <Field full>
            <Label>Screenshot</Label>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <label className="focus-ring group flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-sm border border-dashed border-border bg-void transition-colors hover:border-redstone/60 sm:w-64">
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

          <Field full>
            <Label>Work screenshots (optional)</Label>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-tungsten/60">
              shown in the lightbox carousel — add as many as you want
            </p>
            <div className="flex flex-wrap gap-3">
              {imagesList.map((url, i) => (
                <div key={i} className="relative h-24 w-32 overflow-hidden rounded-sm border border-border">
                  <Image src={url} alt={`work ${i + 1}`} className="h-full w-full object-cover" fittingType="fill" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    aria-label="Remove"
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-sm border border-border bg-void/80 text-redstone transition-colors hover:bg-redstone hover:text-void"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="focus-ring flex h-24 w-32 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-sm border border-dashed border-border bg-void transition-colors hover:border-redstone/60">
                {uploadingExtra ? (
                  <Loader2 className="h-5 w-5 animate-spin text-redstone" />
                ) : (
                  <Plus className="h-5 w-5 text-tungsten" />
                )}
                <span className="font-mono text-[9px] uppercase tracking-widest text-tungsten">
                  {uploadingExtra ? "…" : "add photo"}
                </span>
                <input type="file" accept="image/*" onChange={onUploadExtra} className="hidden" />
              </label>
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
              {editingId ? "Save changes" : "Add server"}
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
        <h2 className="font-heading text-lg font-semibold text-iron">Registered servers</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-tungsten">
          {servers === null ? "…" : `${servers.length} total`}
        </span>
      </div>

      {servers === null ? (
        <div className="mt-6 flex items-center justify-center py-12 text-tungsten">
          <Loader2 className="h-5 w-5 animate-spin text-redstone" />
        </div>
      ) : servers.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-tungsten/70">
          no servers yet — add your first above
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {servers.map((s) => (
            <div key={s.id} className="flex items-center gap-4 rounded-sm border border-border bg-bedrock p-3">
              {s.image_url ? (
                <Image src={s.image_url} alt={s.name} className="h-14 w-20 shrink-0 rounded-sm object-cover" fittingType="fill" />
              ) : (
                <div className="grid-chunks flex h-14 w-20 shrink-0 items-center justify-center rounded-sm opacity-40">
                  <ServerIcon className="h-4 w-4 text-tungsten" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-heading text-sm font-semibold text-iron">{s.name}</span>
                  {s.version && <span className="font-mono text-[10px] uppercase tracking-widest text-tungsten/60">{s.version}</span>}
                </div>
                {s.role && <span className="font-mono text-[11px] uppercase tracking-widest text-tungsten">{s.role}</span>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => edit(s)} aria-label="Edit" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(s)} aria-label="Delete" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function Field({ children, full }) {
  return <div className={full ? "md:col-span-2" : ""}>{children}</div>;
}