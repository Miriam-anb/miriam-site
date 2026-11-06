import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const base = 'group inline-flex items-center justify-center gap-2.5 rounded-xl px-5 py-3 text-[15px] font-semibold leading-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-deep focus-visible:ring-offset-2 active:translate-y-px';
const variants = {
  primary: 'bg-navy-950 text-white hover:bg-navy-800',
  dark: 'bg-navy-950 text-white hover:bg-navy-800',
  accent: 'bg-accent text-navy-950 hover:bg-[#d4f562]',
  outline: 'border border-white/20 bg-white/[.04] text-white hover:border-white/45 hover:bg-white/10',
  outlineDark: 'border border-line bg-white text-navy-950 shadow-[0_1px_2px_rgba(10,23,48,.06)] hover:border-navy-900/30',
  ghost: 'px-0 text-navy-900 hover:text-navy-700',
};
// Pastille de flèche : contraste inversé selon le bouton
const chips = {
  primary: 'bg-accent text-navy-950', dark: 'bg-accent text-navy-950', accent: 'bg-navy-950 text-accent',
  outline: 'bg-white/15 text-white', outlineDark: 'bg-navy-950 text-white', ghost: 'bg-navy-950 text-white',
};

export function Button({ to, href, variant = 'primary', arrow = false, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${arrow ? 'pr-2.5' : ''} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && (
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg transition-transform duration-200 group-hover:translate-x-0.5 ${chips[variant]}`} aria-hidden="true">
          <ArrowRight size={15} strokeWidth={2.4} />
        </span>
      )}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}

export function Eyebrow({ children, light = false }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[.12em] ${light ? 'border-white/15 text-white/70' : 'border-line bg-white text-navy-700'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${light ? 'bg-accent' : 'bg-accent-deep'}`} aria-hidden="true" />
      {children}
    </p>
  );
}

export function Container({ className = '', children }) {
  return <div className={`mx-auto w-full max-w-site px-5 sm:px-8 ${className}`}>{children}</div>;
}

// Apparition douce au défilement (désactivée si l'utilisateur préfère moins d'animations)
export function Reveal({ children, delay = 0, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} {...rest} className={`${className} ${shown ? 'animate-rise' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function SectionHead({ eyebrow, title, lead, light = false, center = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow light={light}>{eyebrow}</Eyebrow>}
      <h2 className={`mt-5 text-3xl font-bold leading-[1.08] sm:text-[2.7rem] ${light ? 'text-white' : 'text-navy-950'}`}>{title}</h2>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-ink/70'}`}>{lead}</p>}
    </div>
  );
}

// Grain discret des sections sombres (texture « papier », plus naturelle qu'une grille)
export function GridBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.06] mix-blend-overlay"
         style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
  );
}
