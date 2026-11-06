import { Download, Languages, MapPin, Cpu, Workflow, Bot, PlugZap, Code2, Target, GraduationCap, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { site } from '../data/site.js';
import { Button, Container, Reveal, SectionHead } from '../components/ui.jsx';
import { CtaBand, PageHeader } from '../components/blocks.jsx';

const icons = [Cpu, Workflow, Bot, PlugZap, Code2, Target];

// Met en gras les passages entourés de **
const rich = (txt) => txt.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? <strong key={i} className="font-semibold text-navy-950">{part}</strong> : part));

const Bullets = ({ items }) => (
  <ul className="mt-3 space-y-2 text-[15px] leading-relaxed text-ink/75">
    {items.map((x) => <li key={x} className="flex gap-2.5"><Check size={16} className="mt-1 shrink-0 text-accent-deep" aria-hidden="true" />{x}</li>)}
  </ul>
);

export default function About() {
  const { lang, t } = useI18n();
  useSeo(t.meta.about, lang, 'about');
  const a = t.about;
  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={a.title}>
        <Reveal delay={160} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/60">
          <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-accent" aria-hidden="true" />{site.city}</span>
          <span className="inline-flex items-center gap-2"><Languages size={15} className="text-accent" aria-hidden="true" />{a.languages}</span>
        </Reveal>
      </PageHeader>

      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal className="space-y-5 text-lg leading-relaxed text-ink/75">
            {a.intro.map((p) => <p key={p}>{rich(p)}</p>)}
            <p className="flex items-start gap-3 rounded-xl border border-accent-deep/25 bg-accent-soft px-4 py-3 text-base text-navy-900">
              <span className="relative mt-2 flex h-2.5 w-2.5 shrink-0" aria-hidden="true"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-deep opacity-50" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-deep" /></span>
              <span className="font-semibold">{a.availability}</span>
            </p>
            <div className="flex flex-wrap gap-3 pt-3">
              <Button to={href(lang, 'projects')} variant="dark" arrow>{t.common.seeProjects}</Button>
              <Button to={href(lang, 'contact')} variant="outlineDark">{t.common.discuss}</Button>
              <Button href={site.cv} download variant="outlineDark"><Download size={16} aria-hidden="true" />{t.common.downloadCv}</Button>
            </div>
          </Reveal>
          <Reveal delay={120} className="rounded-[24px] bg-mist p-7 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-navy-600">{a.stackTitle}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {a.stack.map((s) => <span key={s} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-navy-900">{s}</span>)}
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <SectionHead eyebrow={a.eyebrow} title={a.strengthsTitle} />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.strengths.map((s, i) => {
              const Icon = icons[i];
              return (
                <Reveal key={s.title} delay={(i % 3) * 80} className="rounded-2xl border border-line p-6">
                  <Icon size={22} className="text-accent-deep" aria-hidden="true" />
                  <h3 className="mt-4 font-bold text-navy-950">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{s.text}</p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-mist py-20">
        <Container>
          <SectionHead title={a.pathTitle} />
          <ol className="relative ml-2 mt-12 border-l border-navy-900/15 pl-8">
            {a.path.map((p, i) => (
              <Reveal as="li" key={p.period} delay={Math.min(i, 3) * 60} className="relative pb-12 last:pb-0">
                <span className={`absolute -left-[42px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-mist ${i === 0 ? 'bg-accent-deep' : p.education ? 'bg-navy-900' : 'bg-navy-600/50'}`} aria-hidden="true">
                  {p.education && <GraduationCap size={11} className="text-white" />}
                </span>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-navy-600">{p.period}</p>
                <h3 className="mt-1.5 text-lg font-bold leading-snug text-navy-950 sm:text-xl">{p.role}</h3>
                {p.place && <p className="mt-0.5 text-sm font-medium text-ink/55">{p.place}</p>}
                {p.items && <div className="max-w-3xl"><Bullets items={p.items} /></div>}
                {p.groups && (
                  <div className="mt-4 grid max-w-4xl gap-4 lg:grid-cols-2">
                    {p.groups.map((g) => (
                      <div key={g.title} className="rounded-2xl border border-line bg-white p-5">
                        <p className="text-sm font-bold text-navy-900">{g.title}</p>
                        <Bullets items={g.items} />
                      </div>
                    ))}
                  </div>
                )}
                {p.stack && <p className="mt-4 max-w-3xl text-sm text-ink/60"><span className="font-semibold text-navy-900">{t.common.stack} · </span>{p.stack}</p>}
                {p.link && (
                  <Link to={href(lang, 'projects')} className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-deep">
                    {a.seeProjects}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                )}
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
