import { Bot, Workflow, Megaphone, PlugZap, Check } from 'lucide-react';
import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { projects } from '../data/projects.js';
import { Button, Container, Eyebrow, GridBackdrop, Reveal, SectionHead } from '../components/ui.jsx';
import { CtaBand, Process, ProjectCard } from '../components/blocks.jsx';
import HeroIllustration from '../components/HeroIllustration.jsx';

const pillarIcons = [Bot, Workflow, Megaphone, PlugZap];

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
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.pillars.map((p, i) => {
              const Icon = pillarIcons[i];
              return (
                <Reveal key={p.title} delay={i * 80} className="group rounded-2xl border border-line p-7 transition-all duration-300 hover:border-navy-900/20 hover:shadow-[0_24px_50px_-30px_rgba(10,23,48,.4)]">
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
            {projects.filter((p) => p.category === 'ai').slice(0, 3).map((p, i) => <ProjectCard key={p.slug} p={p} delay={i * 80} />)}
          </div>
        </Container>
      </section>

      <Process />
      <CtaBand />
    </>
  );
}
