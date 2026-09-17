import {
  Cpu, Gauge, GitBranch, Terminal, Boxes, Zap,
  Users, ShieldCheck, CalendarDays, Hammer, Scale, Activity,
  Server, Code2, BarChart3, Database, Wrench, Cog, Sparkles, Shield, Sword,
} from "lucide-react";

export const ICON_MAP = {
  Cpu, Gauge, GitBranch, Terminal, Boxes, Zap,
  Users, ShieldCheck, CalendarDays, Hammer, Scale, Activity,
  Server, Code2, BarChart3, Database, Wrench, Cog, Sparkles, Shield, Sword,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export function getIcon(name) {
  return ICON_MAP[name] || Boxes;
}