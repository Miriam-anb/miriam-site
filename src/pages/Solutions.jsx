import { MessagesSquare, FileText, Users, BellRing, Megaphone, PhoneCall, FolderCog, ArrowRight, ArrowDown } from 'lucide-react';
import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { Button, Container, Reveal } from '../components/ui.jsx';
import { CtaBand, PageHeader } from '../components/blocks.jsx';

const icons = [MessagesSquare, FileText, Users, BellRing, Megaphone, PhoneCall, FolderCog];

export default function Solutions() {
  const { lang, t } = useI18n();
  useSeo(t.meta.solutions, lang, 'solutions');
  const s = t.solutions;
  return (
    <>
      <PageHeader eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
      <section className="py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          {s.items.map((it, i) => {
            const Icon = icons[i];
            const steps = [
              { label: t.common.problem, text: it.problem, cls: 'bg-mist text-ink/80' },
              { label: t.common.aiSolution, text: it.ai, cls: 'bg-navy-950 text-white/80', light: true },
              { label: t.common.result, text: it.result, cls: 'bg-accent-soft text-navy-950' },
            ];
            return (
              <Reveal as="article" key={it.title} delay={(i % 2) * 80} className={`${i === s.items.length - 1 && s.items.length % 2 ? 'md:col-span-2' : ''} flex flex-col rounded-[24px] border border-line p-6 transition-shadow duration-300 hover:shadow-[0_24px_50px_-30px_rgba(10,23,48,.4)] sm:p-8`}>
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-950 text-accent"><Icon size={20} aria-hidden="true" /></span>
                  <h2 className="text-lg font-bold leading-snug text-navy-950 sm:text-xl">{it.title}</h2>
                </div>
                <div className="mt-6 flex flex-1 flex-col gap-2">
                  {steps.map((st, k) => (
                    <div key={st.label}>
                      <div className={`rounded-xl px-4 py-3.5 text-sm leading-relaxed ${st.cls}`}>
                        <span className={`block text-[11px] font-bold uppercase tracking-[.14em] ${st.light ? 'text-accent' : 'text-navy-600'}`}>{st.label}</span>
                        <span className="mt-1 block">{st.text}</span>
                      </div>
                      {k < 2 && <ArrowDown size={16} className="mx-auto my-1 text-navy-600/40" aria-hidden="true" />}
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button to={`${href(lang, 'contact')}?solution=${i + 1}`} variant="ghost">{t.common.discuss}<ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></Button>
                </div>
              </Reveal>
            );
          })}
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
