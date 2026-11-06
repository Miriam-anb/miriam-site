import { Bot, Workflow, Megaphone, PlugZap, Check, LayoutGrid, Lightbulb, Briefcase, Handshake, Wrench, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { projects } from '../data/projects.js';
import { Button, Container, Eyebrow, GridBackdrop, Reveal, SectionHead } from '../components/ui.jsx';
import { CtaBand, Process, ProjectCard } from '../components/blocks.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';

const pillarIcons = [Bot, Workflow, Megaphone, PlugZap, LayoutGrid];
const wayIcons = { projet: Lightbulb, mission: Briefcase, agence: Handshake, suivi: Wrench };

export default function Home() {
  const { lang, t } = useI18n();
  useSeo(t.meta.home, lang, 'home');
  const h = t.home;
  return (
    <>
      {/* En-tête */}
      <section className="relative overflow-hidden bg-navy-950">
        <GridBackdrop />
        <Container className="relative grid items-center gap-12 pb-24 pt-14 lg:grid-cols-[1.08fr_.92fr] lg:pb-28 lg:pt-20">
          <div>
            <Reveal>
              <Link to={href(lang, 'contact')} className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-accent/30 bg-accent/10 py-1.5 pl-3 pr-4 text-[13px] font-semibold text-accent transition hover:border-accent/60 hover:bg-accent/15">
                <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
                </span>
                {h.available}
              </Link>
            </Reveal>
            <Reveal><Eyebrow light>{h.eyebrow}</Eyebrow></Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 text-[2.5rem] font-bold leading-[1.06] tracking-tight text-white sm:text-6xl">
                {h.title1} <span className="font-serif text-[1.08em] font-normal italic text-accent">{h.titleEm}</span> {h.title2}
              </h1>
            </Reveal>
            <Reveal delay={160}><p className="mt-7 max-w-xl text-lg leading-relaxed text-white/70">{h.subtitle}</p></Reveal>
            <Reveal delay={240} className="mt-9 flex flex-wrap gap-3">
              <Button to={href(lang, 'services')} arrow>{t.common.discover}</Button>
              <Button to={href(lang, 'projects')} variant="outline">{t.common.seeProjects}</Button>
              <Button to={href(lang, 'contact')} variant="outline">{t.common.discuss}</Button>
            </Reveal>
            <Reveal delay={320}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
                {h.trust.map((x) => <li key={x} className="inline-flex items-center gap-2"><Check size={15} className="text-accent" aria-hidden="true" />{x}</li>)}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={200} className="relative">
            <div className="rounded-[28px] border border-white/10 bg-navy-900/60 p-4 shadow-[0_40px_80px_-40px_rgba(0,0,0,.8)] sm:p-6">
              <HeroIllustration />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Ce que je fais */}
      <section className="py-24">
        <Container>
          <SectionHead eyebrow={t.nav.services} title={h.whatTitle} lead={h.whatLead} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {h.pillars.map((p, i) => {
              const Icon = pillarIcons[i];
              return (
                <Reveal key={p.title} delay={i * 80} className="group rounded-2xl border border-line p-6 transition-all duration-300 hover:border-navy-900/20 hover:shadow-[0_24px_50px_-30px_rgba(10,23,48,.4)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-950 text-accent transition-transform duration-300 group-hover:-translate-y-1">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold text-navy-950">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.text}</p>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-10"><Button to={href(lang, 'services')} variant="outlineDark" arrow>{t.common.discover}</Button></div>
        </Container>
      </section>

      {/* Réalisations */}
      <section className="border-t border-line py-24">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHead eyebrow={t.nav.projects} title={h.projectsTitle} lead={h.projectsLead} />
            <Button to={href(lang, 'projects')} variant="outlineDark" arrow>{t.common.seeProjects}</Button>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['agent-musique-youtube', 'agent-emploi', 'reseau-lourd'].map((s) => projects.find((p) => p.slug === s)).filter(Boolean).map((p, i) => <ProjectCard key={p.slug} p={p} delay={i * 80} />)}
          </div>
        </Container>
      </section>

      {/* Travaillons ensemble */}
      <section className="relative overflow-hidden bg-navy-950 py-24">
        <GridBackdrop />
        <Container className="relative">
          <SectionHead eyebrow="Collaboration" title={h.workTitle} lead={h.workLead} light />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.ways.map((w, i) => {
              const Icon = wayIcons[w.id];
              return (
                <Reveal key={w.id} delay={i * 80} className="group flex flex-col rounded-2xl border border-white/10 bg-white/[.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[.05]">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-navy-950"><Icon size={20} aria-hidden="true" /></span>
                  <h3 className="mt-5 text-lg font-bold text-white">{w.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60">{w.text}</p>
                  <Link to={`${href(lang, 'contact')}?collab=${w.id}`} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    {w.cta}<ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <Process />
      <CtaBand />
    </>
  );
}
