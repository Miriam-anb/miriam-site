import { useState } from 'react';
import { useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { projects } from '../data/projects.js';
import { Container } from '../components/ui.jsx';
import { CtaBand, PageHeader, ProjectCard } from '../components/blocks.jsx';

export default function Projects() {
  const { lang, t } = useI18n();
  useSeo(t.meta.projects, lang, 'projects');
  const [filter, setFilter] = useState('all');
  const p = t.projects;
  const list = filter === 'all' ? projects : projects.filter((x) => x.category === filter);
  const filters = [['all', t.common.all], ['ai', p.filters.ai], ['web', p.filters.web]];
  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} lead={p.lead} />
      <section className="py-20">
        <Container>
          <div className="flex flex-wrap gap-2" role="group" aria-label={p.eyebrow}>
            {filters.map(([k, label]) => (
              <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === k ? 'bg-navy-950 text-white' : 'border border-line text-ink/70 hover:border-navy-900/30'}`}>
                {label} <span className="ml-1 opacity-50">{k === 'all' ? projects.length : projects.filter((x) => x.category === k).length}</span>
              </button>
            ))}
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((x, i) => <ProjectCard key={`${filter}-${x.slug}`} p={x} delay={(i % 3) * 80} />)}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
