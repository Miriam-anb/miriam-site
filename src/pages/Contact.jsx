import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MessageCircle, Linkedin, Phone, Send, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { site, whatsappLink } from '../data/site.js';
import { projects } from '../data/projects.js';
import { Button, Container, Reveal } from '../components/ui.jsx';
import { PageHeader } from '../components/blocks.jsx';

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Contact() {
  const { lang, t } = useI18n();
  useSeo(t.meta.contact, lang, 'contact');
  const c = t.contact;
  const f = c.form;
  const [params] = useSearchParams();

  const initial = useMemo(() => {
    const service = params.get('service');
    const proj = projects.find((p) => p.slug === params.get('projet'));
    const sol = t.solutions.items[Number(params.get('solution')) - 1];
    let description = '';
    if (proj) description = `${t.common.askDemo} : ${proj[lang].name}\n\n`;
    if (sol) description = `${sol.title}\n\n`;
    return { name: '', company: '', email: '', service: t.services.items.some((s) => s.id === service) ? service : '', description, budget: '', website: '' };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const set = (k) => (e) => { setData({ ...data, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: null }); };

  const validate = () => {
    const e = {};
    if (!data.name.trim()) e.name = f.required;
    if (!data.email.trim()) e.email = f.required; else if (!emailRe.test(data.email.trim())) e.email = f.invalidEmail;
    if (!data.service) e.service = f.required;
    if (data.description.trim().length < 10) e.description = f.required;
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setStatus('sending');
    const serviceLabel = t.services.items.find((s) => s.id === data.service)?.title || f.other;
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, serviceLabel, lang }),
      });
      if (!r.ok) throw new Error();
      setStatus('success');
      setData({ ...initial, description: '', service: '' });
    } catch {
      setStatus('error');
    }
  };

  const field = 'mt-2 w-full rounded-xl border bg-white px-4 py-3 text-[15px] text-ink outline-none transition placeholder:text-ink/35 focus:border-navy-600 focus:ring-4 focus:ring-navy-600/10';
  const cls = (k) => `${field} ${errors[k] ? 'border-red-400' : 'border-line'}`;
  const Label = ({ k, children, opt }) => (
    <label htmlFor={`f-${k}`} className="text-sm font-semibold text-navy-950">
      {children}{opt ? <span className="ml-1 font-normal text-ink/45">({f.optional})</span> : <span className="text-accent-deep"> *</span>}
    </label>
  );
  const Err = ({ k }) => errors[k] ? <p id={`e-${k}`} className="mt-1.5 text-sm text-red-600">{errors[k]}</p> : null;
  const aria = (k) => ({ id: `f-${k}`, 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `e-${k}` : undefined });

  const direct = [
    { icon: Mail, label: site.email, href: `mailto:${site.email}` },
    { icon: MessageCircle, label: 'WhatsApp', href: whatsappLink(c.whatsappText), ext: true },
    { icon: Phone, label: site.phoneDisplay, href: `tel:+${site.whatsapp}` },
    { icon: Linkedin, label: 'LinkedIn', href: site.linkedin, ext: true },
  ];

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} lead={c.lead} />
      <section className="py-20">
        <Container className="grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <Reveal>
            {status === 'success' ? (
              <div className="rounded-[24px] border border-accent-deep/30 bg-accent-soft p-8 sm:p-10" role="status">
                <CheckCircle2 size={32} className="text-accent-deep" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold text-navy-950">{f.success}</p>
                <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-semibold text-navy-700 underline underline-offset-4">{f.send}</button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="rounded-[24px] border border-line p-6 sm:p-9">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div><Label k="name">{f.name}</Label><input {...aria('name')} className={cls('name')} value={data.name} onChange={set('name')} autoComplete="name" /><Err k="name" /></div>
                  <div><Label k="company" opt>{f.company}</Label><input {...aria('company')} className={cls('company')} value={data.company} onChange={set('company')} autoComplete="organization" /></div>
                  <div><Label k="email">{f.email}</Label><input {...aria('email')} type="email" className={cls('email')} value={data.email} onChange={set('email')} autoComplete="email" /><Err k="email" /></div>
                  <div>
                    <Label k="service">{f.service}</Label>
                    <select {...aria('service')} className={cls('service')} value={data.service} onChange={set('service')}>
                      <option value="">{f.choose}</option>
                      {t.services.items.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                      <option value="other">{f.other}</option>
                    </select>
                    <Err k="service" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label k="description">{f.description}</Label>
                    <textarea {...aria('description')} rows={6} className={cls('description')} value={data.description} onChange={set('description')} placeholder={f.placeholderDesc} />
                    <Err k="description" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label k="budget" opt>{f.budget}</Label>
                    <select {...aria('budget')} className={cls('budget')} value={data.budget} onChange={set('budget')}>
                      <option value="">—</option>
                      {f.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  {/* Piège anti-robots : invisible pour les humains */}
                  <div className="hidden" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={data.website} onChange={set('website')} name="website" /></div>
                </div>
                {status === 'error' && (
                  <p className="mt-6 flex gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert"><AlertTriangle size={18} className="shrink-0" aria-hidden="true" />{f.error}</p>
                )}
                <div className="mt-7"><Button type="submit" disabled={status === 'sending'} className="disabled:opacity-60"><Send size={16} aria-hidden="true" />{status === 'sending' ? f.sending : f.send}</Button></div>
              </form>
            )}
          </Reveal>
          <Reveal delay={120} as="aside" className="h-fit rounded-[24px] bg-navy-950 p-7 text-white sm:p-8">
            <p className="text-lg font-bold">{c.direct}</p>
            <ul className="mt-6 space-y-2">
              {direct.map(({ icon: Icon, label, href, ext }) => (
                <li key={label}>
                  <a href={href} {...(ext ? { target: '_blank', rel: 'noopener' } : {})} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3.5 text-sm font-medium text-white/80 transition hover:border-accent/60 hover:text-white">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-accent"><Icon size={17} aria-hidden="true" /></span>
                    <span className="truncate">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex gap-2 text-sm text-white/55"><Clock size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{c.response}</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
