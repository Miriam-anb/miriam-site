import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const base = 'group inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';
const variants = {
  primary: 'bg-accent text-navy-950 hover:bg-[#d6f56f] hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(200,240,75,.8)]',
  dark: 'bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-0.5',
  outline: 'border border-white/25 text-white hover:border-white/60 hover:bg-white/5',
  outlineDark: 'border border-navy-900/15 text-navy-900 hover:border-navy-900/40 hover:bg-navy-900/[.03]',
  ghost: 'text-navy-900 hover:text-navy-700 px-0',
};

export function Button({ to, href, variant = 'primary', arrow = false, className = '', children, ...rest }) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      {children}
      {arrow && <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...rest}>{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}

export function Eyebrow({ children, light = false }) {
  return (
    <p className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] ${light ? 'text-accent' : 'text-navy-600'}`}>
      <span className={`h-px w-6 ${light ? 'bg-accent' : 'bg-navy-600'}`} aria-hidden="true" />
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
      <h2 className={`mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-[2.6rem] ${light ? 'text-white' : 'text-navy-950'}`}>{title}</h2>
      {lead && <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-white/70' : 'text-ink/70'}`}>{lead}</p>}
    </div>
  );
}

// Fond quadrillé discret des sections sombres
export function GridBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[.07]"
         style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at 70% 40%, #000 30%, transparent 75%)' }} />
  );
}
