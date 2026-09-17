import React, { useEffect, useState, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Pencil, Loader2, Plus, BarChart3 } from "lucide-react";
import { ICON_NAMES, getIcon } from "@/lib/iconMap";

const EMPTY = {
  label: "",
  value: "",
  note: "",
  icon: "Activity",
  order: 0,
};

export default function MetricsManager() {
  const [metrics, setMetrics] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await base44.entities.Metric.list("order", 50);
      setMetrics(data);
    } catch (e) {
      setMetrics([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const reset = () => {
    setForm(EMPTY);
    setEditingId(null);
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) {
      setError("Metric label is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editingId) {
        await base44.entities.Metric.update(editingId, payload);
      } else {
        await base44.entities.Metric.create(payload);
      }
      reset();
      await load();
    } catch (err) {
      setError("Could not save. Check your fields and retry.");
    } finally {
      setSaving(false);
    }
  };

  const edit = (m) => {
    setEditingId(m.id);
    setForm({
      label: m.label ?? "",
      value: m.value ?? "",
      note: m.note ?? "",
      icon: m.icon ?? "Activity",
      order: m.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete "${m.label}"?`)) return;
    try {
      await base44.entities.Metric.delete(m.id);
      await load();
    } catch (err) {
      setError("Could not delete metric.");
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
            <BarChart3 className="h-4 w-4" />
          </span>
          <h1 className="font-heading text-2xl font-bold text-iron">
            {editingId ? "Edit Metric" : "Add Metric"}
          </h1>
        </div>

        <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field>
            <Label htmlFor="label">Label *</Label>
            <Input id="label" value={form.label} onChange={set("label")} placeholder="Users Managed" className="bg-void border-border" />
          </Field>

          <Field>
            <Label htmlFor="value">Value</Label>
            <Input id="value" value={form.value} onChange={set("value")} placeholder="40k+" className="bg-void border-border" />
          </Field>

          <Field full>
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" value={form.note} onChange={set("note")} placeholder="Short caption under the value" className="bg-void border-border min-h-[70px]" />
          </Field>

          <Field>
            <Label htmlFor="icon">Icon</Label>
            <select id="icon" value={form.icon} onChange={set("icon")} className={selectClass}>
              {ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>

          <Field>
            <Label htmlFor="order">Display order</Label>
            <Input id="order" type="number" value={form.order} onChange={set("order")} placeholder="0" className="bg-void border-border" />
          </Field>

          {error && (
            <p className="md:col-span-2 font-mono text-sm text-redstone">
              <span className="text-redstone">›</span> {error}
            </p>
          )}

          <div className="md:col-span-2 flex flex-wrap gap-3">
            <Button type="submit" disabled={saving} className="focus-ring gap-2 rounded-sm border border-redstone bg-redstone font-mono text-xs uppercase tracking-widest text-void hover:bg-redstone/90">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {editingId ? "Save changes" : "Add metric"}
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
        <h2 className="font-heading text-lg font-semibold text-iron">Registered metrics</h2>
        <span className="font-mono text-[11px] uppercase tracking-widest text-tungsten">
          {metrics === null ? "…" : `${metrics.length} total`}
        </span>
      </div>

      {metrics === null ? (
        <div className="mt-6 flex items-center justify-center py-12 text-tungsten">
          <Loader2 className="h-5 w-5 animate-spin text-redstone" />
        </div>
      ) : metrics.length === 0 ? (
        <p className="mt-6 rounded-sm border border-dashed border-border py-10 text-center font-mono text-xs uppercase tracking-widest text-tungsten/70">
          no metrics yet — add your first above
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {metrics.map((m) => {
            const Icon = getIcon(m.icon);
            return (
              <div key={m.id} className="flex items-center gap-4 rounded-sm border border-border bg-bedrock p-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-border bg-void text-redstone">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-heading text-sm font-semibold text-iron">{m.value}</span>
                    {m.label && <span className="font-mono text-[10px] uppercase tracking-widest text-tungsten/60">{m.label}</span>}
                  </div>
                  {m.note && <span className="line-clamp-1 font-mono text-[11px] uppercase tracking-widest text-tungsten">{m.note}</span>}
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => edit(m)} aria-label="Edit" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(m)} aria-label="Delete" className="focus-ring flex h-10 w-10 items-center justify-center rounded-sm border border-border text-tungsten transition-colors hover:border-redstone hover:text-redstone">
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