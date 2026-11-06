import { Bot, Workflow, Megaphone, PlugZap, LayoutGrid, Check, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { Button, Container, Reveal } from '../components/ui.jsx';
import { CtaBand, PageHeader, Process } from '../components/blocks.jsx';

const icons = { agents: Bot, process: Workflow, marketing: Megaphone, api: PlugZap, web: LayoutGrid };

export default function Services() {
  const { lang, t } = useI18n();
  useSeo(t.meta.services, lang, 'services');
  const s = t.services;
  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead}>
        <Reveal delay={240} className="mt-10 flex flex-wrap gap-2">
          {s.items.map((it) => (
            <a key={it.id} href={`#${it.id}`} className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/75 transition hover:border-accent hover:text-white">{it.title}</a>
          ))}
        </Reveal>
      </PageHeader>
      <section className="py-20">
        <Container className="space-y-8">
          {s.items.map((it, i) => {
            const Icon = icons[it.id];
            return (
              <Reveal as="article" key={it.id} id={it.id} className="scroll-mt-28 overflow-hidden rounded-[26px] border border-line">
                <div className="grid lg:grid-cols-[.9fr_1.1fr]">
                  <div className="relative bg-navy-950 p-8 sm:p-10">
                    <span className="font-serif text-6xl italic text-white/10">0{i + 1}</span>
                    <span className="mt-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-navy-950"><Icon size={22} aria-hidden="true" /></span>
                    <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">{it.title}</h2>
                    <div className="mt-6 space-y-4 text-[15px] leading-relaxed">
                      <p className="flex gap-3 text-white/65"><AlertCircle size={18} className="mt-0.5 shrink-0 text-white/40" aria-hidden="true" /><span><strong className="text-white">{t.common.problem} · </strong>{it.problem}</span></p>
                      <p className="flex gap-3 text-white/65"><Lightbulb size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" /><span><strong className="text-white">{t.common.solution} · </strong>{it.solution}</span></p>
                    </div>
                  </div>
                  <div className="grid gap-8 p-8 sm:grid-cols-2 sm:p-10">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.16em] text-navy-600">{t.common.features}</p>
                      <ul className="mt-4 space-y-3 text-[15px] text-ink/80">
                        {it.features.map((f) => <li key={f} className="flex gap-2.5"><Check size={18} className="mt-0.5 shrink-0 text-accent-deep" aria-hidden="true" />{f}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.16em] text-navy-600">{t.common.benefits}</p>
                      <ul className="mt-4 space-y-3 text-[15px] text-ink/80">
                        {it.benefits.map((b) => <li key={b} className="flex gap-2.5"><TrendingUp size={18} className="mt-0.5 shrink-0 text-navy-600" aria-hidden="true" />{b}</li>)}
                      </ul>
                    </div>
                    <div className="sm:col-span-2">
                      <Button to={`${href(lang, 'contact')}?service=${it.id}`} variant="dark" arrow>{t.common.quote}</Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </Container>
      </section>
      <Process />
      <CtaBand />
    </>
  );
}
