import { Bot, Mail, ShoppingBag, Table2, Users, Inbox, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';

// Illustration originale : une demande entre, l'agent IA la traite et agit dans les outils connectés.
const nodes = {
  in: { x: 88, y: 210 },
  agent: { x: 272, y: 210 },
  crm: { x: 470, y: 70 },
  mail: { x: 470, y: 163 },
  sheet: { x: 470, y: 256 },
  shop: { x: 470, y: 349 },
  done: { x: 272, y: 372 },
};

const curve = (a, b) => {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
};

function Node({ x, y, icon: Icon, label, accent = false, small = false, width }) {
  const w = width || (small ? 118 : 156);
  return (
    <g transform={`translate(${x - w / 2} ${y - 22})`}>
      <rect width={w} height="44" rx="12" className={accent ? 'fill-accent' : 'fill-navy-800'} stroke={accent ? 'none' : 'rgba(255,255,255,.12)'} />
      <foreignObject x="0" y="0" width={w} height="44">
        <div className={`flex h-full items-center gap-2 px-3 text-[12.5px] font-semibold ${accent ? 'text-navy-950' : 'text-white/90'}`}>
          <Icon size={16} strokeWidth={2} aria-hidden="true" />
          <span className="truncate">{label}</span>
        </div>
      </foreignObject>
    </g>
  );
}

export default function HeroIllustration() {
  const { t } = useI18n();
  const l = t.home.illu;
  const outs = ['crm', 'mail', 'sheet', 'shop'];
  return (
    <svg viewBox="0 0 560 420" className="h-auto w-full" role="img" aria-label={`${l.trigger} → ${l.agent} → ${l.crm}, ${l.mail}, ${l.sheet}, ${l.shop}`}>
      {/* Liens */}
      <g fill="none" strokeLinecap="round">
        <path d={curve({ x: nodes.in.x + 86, y: nodes.in.y }, { x: nodes.agent.x - 78, y: nodes.agent.y })} stroke="rgba(200,240,75,.55)" strokeWidth="1.6" strokeDasharray="5 5" className="animate-dash" />
        {outs.map((k) => (
          <path key={k} d={curve({ x: nodes.agent.x + 78, y: nodes.agent.y }, { x: nodes[k].x - 59, y: nodes[k].y })} stroke="rgba(255,255,255,.28)" strokeWidth="1.4" strokeDasharray="5 5" className="animate-dash" />
        ))}
        <path d={`M${nodes.agent.x} ${nodes.agent.y + 22} V ${nodes.done.y - 22}`} stroke="rgba(200,240,75,.55)" strokeWidth="1.6" strokeDasharray="5 5" className="animate-dash" />
      </g>
      {/* Points d'activité */}
      {outs.map((k, i) => (
        <circle key={k} cx={nodes[k].x - 59} cy={nodes[k].y} r="3.5" className="fill-accent animate-pulse2" style={{ animationDelay: `${i * 0.45}s` }} />
      ))}
      <circle cx={nodes.agent.x - 78} cy={nodes.agent.y} r="3.5" className="fill-accent animate-pulse2" />

      {/* Halo de l'agent */}
      <circle cx={nodes.agent.x} cy={nodes.agent.y} r="62" fill="rgba(200,240,75,.06)" stroke="rgba(200,240,75,.18)" />

      <Node {...nodes.in} icon={Inbox} label={l.trigger} width={172} />
      <Node {...nodes.agent} icon={Bot} label={l.agent} accent />
      <Node {...nodes.crm} icon={Users} label={l.crm} small />
      <Node {...nodes.mail} icon={Mail} label={l.mail} small />
      <Node {...nodes.sheet} icon={Table2} label={l.sheet} small />
      <Node {...nodes.shop} icon={ShoppingBag} label={l.shop} small />
      <Node {...nodes.done} icon={CheckCircle2} label={l.done} />
    </svg>
  );
}
