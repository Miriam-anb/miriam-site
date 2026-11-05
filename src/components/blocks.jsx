import { ArrowUpRight, Check, MessageSquare } from 'lucide-react';
import { href, useI18n } from '../i18n/index.jsx';
import { Button, Container, Eyebrow, GridBackdrop, Reveal, SectionHead } from './ui.jsx';

// En-tête sombre des pages intérieures
export function PageHeader({ eyebrow, title, lead, children }) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-16 sm:pb-24 sm:pt-20">
      <GridBackdrop />
      <Container className="relative">
        <Reveal><Eyebrow light>{eyebrow}</Eyebrow></Reveal>
        <Reveal delay={80}><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">{title}</h1></Reveal>
        {lead && <Reveal delay={160}><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">{lead}</p></Reveal>}
        {children}
      </Container>
    </section>
  );
}

export function Process() {
  const { t } = useI18n();
  return (
    <section className="bg-mist py-24">
      <Container>
        <SectionHead eyebrow="Process" title={t.home.processTitle} lead={t.home.processLead} />
        <ol className="mt-14 grid gap-4 md:grid-cols-5">
          {t.process.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 80} className="relative rounded-2xl border border-line bg-white p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(10,23,48,.35)]">
              <span className="font-serif text-4xl italic text-navy-600/40">0{i + 1}</span>
              <h3 className="mt-4 text-[15px] font-bold leading-snug text-navy-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/65">{s.text}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function CtaBand() {
  const { lang, t } = useI18n();
  return (
    <section className="py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[28px] bg-navy-900 px-8 py-14 sm:px-14">
          <GridBackdrop />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">{t.home.ctaTitle}</h2>
              <p className="mt-4 text-lg text-white/70">{t.home.ctaText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button to={href(lang, 'contact')} arrow>{t.common.book}</Button>
              <Button to={href(lang, 'contact')} variant="outline">{t.common.quote}</Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// Visuel de remplacement tant qu'il n'y a pas de capture : abstrait, sans fausses données
function ProjectVisual({ type }) {
  const bars = { catalog: [70, 50, 85, 60], ads: [40, 75, 55, 90], jobs: [60, 80, 45, 70], map: [55, 65, 80, 50], grid: [75, 45, 60, 85] }[type] || [60, 60, 60, 60];
  return (
    <div className="relative h-full w-full overflow-hidden bg-navy-900" aria-hidden="true">
      <GridBackdrop />
      <div className="absolute inset-6 rounded-xl border border-white/10 bg-navy-950/60 p-4">
        <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-accent/70" /></div>
        <div className="mt-4 grid grid-cols-[1fr_2fr] gap-3">
          <div className="space-y-2">{[1, 2, 3, 4].map((i) => <div key={i} className="h-2 rounded bg-white/10" />)}</div>
          <div className="flex items-end gap-2">{bars.map((h, i) => <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-accent/60 to-accent/10" style={{ height: `${h}%`, minHeight: 24 }} />)}</div>
        </div>
      </div>
    </div>
  );
}

export function ProjectCard({ p, delay = 0 }) {
  const { lang, t } = useI18n();
  const c = p[lang];
  return (
    <Reveal delay={delay} as="article" className="group flex flex-col overflow-hidden rounded-[22px] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-32px_rgba(10,23,48,.45)]">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
        {p.image
          ? <img src={p.image} alt={c.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
          : <ProjectVisual type={p.visual} />}
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-navy-900 backdrop-blur">
          {t.projects.filters[p.category]}
        </span>
        {!p.image && <span className="absolute bottom-3 right-4 text-[11px] font-medium text-white/40">{t.projects.noCapture}</span>}
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="text-xl font-bold tracking-tight text-navy-950">{c.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/70">{c.description}</p>
        <p className="mt-4 rounded-xl bg-mist px-4 py-3 text-sm text-ink/80"><span className="font-semibold text-navy-900">{t.common.problem} · </span>{c.problem}</p>
        <ul className="mt-4 space-y-1.5 text-sm text-ink/75">
          {c.features.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-accent-deep" aria-hidden="true" />{f}</li>)}
        </ul>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {p.stack.map((s) => <span key={s} className="rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink/70">{s}</span>)}
        </div>
        <div className="mt-auto pt-6">
          {p.demo
            ? <Button href={p.demo} target="_blank" rel="noopener" variant="dark">{t.common.demo}<ArrowUpRight size={16} aria-hidden="true" /></Button>
            : p.client
              ? <span className="inline-flex items-center gap-2 text-sm font-medium text-ink/50">{t.common.clientProject}</span>
              : <Button to={`${href(lang, 'contact')}?projet=${p.slug}`} variant="outlineDark"><MessageSquare size={16} aria-hidden="true" />{t.common.askDemo}</Button>}
        </div>
      </div>
    </Reveal>
  );
}
