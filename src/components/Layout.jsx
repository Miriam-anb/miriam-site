import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Mail, MessageCircle, Linkedin, Download, MapPin } from 'lucide-react';
import { href, useI18n, useSwitchHref } from '../i18n/index.jsx';
import { site, whatsappLink } from '../data/site.js';
import { Button, Container } from './ui.jsx';

const pages = ['services', 'solutions', 'projects', 'about', 'contact'];

function Logo({ lang, dark = false }) {
  return (
    <Link to={href(lang, 'home')} className="flex items-center gap-3" aria-label="Miriam ANIBABA">
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl font-display text-[15px] font-extrabold tracking-tight ${dark ? 'bg-accent text-navy-950' : 'bg-navy-950 text-accent'}`}>MA</span>
      <span className="leading-tight">
        <span className={`block font-display text-[16px] font-bold tracking-tight ${dark ? 'text-white' : 'text-navy-950'}`}>Miriam ANIBABA</span>
        <span className={`hidden text-[11px] font-medium uppercase tracking-[.14em] sm:block ${dark ? 'text-white/50' : 'text-ink/50'}`}>AI Agents · Automation</span>
      </span>
    </Link>
  );
}

function LangSwitch() {
  const { lang } = useI18n();
  const { to } = useSwitchHref();
  return (
    <div className="flex items-center rounded-lg border border-line bg-white p-0.5 text-xs font-bold" role="group" aria-label="Langue / Language">
      {['fr', 'en'].map((l) => (
        l === lang
          ? <span key={l} className="rounded-md bg-navy-950 px-2.5 py-1 text-white" aria-current="true">{l.toUpperCase()}</span>
          : <Link key={l} to={to} className="rounded-md px-2.5 py-1 text-ink/55 transition hover:text-navy-950" hrefLang={l}>{l.toUpperCase()}</Link>
      ))}
    </div>
  );
}

function Navbar() {
  const { lang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  const linkCls = ({ isActive }) => `relative py-2 text-sm font-medium transition-colors ${isActive ? 'text-navy-950' : 'text-ink/60 hover:text-navy-950'} after:absolute after:-bottom-0.5 after:left-0 after:h-[2px] after:rounded-full after:bg-accent-deep after:transition-all ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}`;
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-paper/90 backdrop-blur-md shadow-[0_1px_0_#E6E1D6]' : 'bg-paper'}`}>
      <Container className="flex h-[72px] items-center justify-between gap-6">
        <Logo lang={lang} />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navigation principale">
          {pages.map((p) => <NavLink key={p} to={href(lang, p)} className={linkCls}>{t.nav[p]}</NavLink>)}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <LangSwitch />
          <Button to={href(lang, 'contact')} className="!py-2.5">{t.nav.cta}</Button>
        </div>
        <div className="flex items-center gap-3 lg:hidden">
          <LangSwitch />
          <button onClick={() => setOpen(!open)} className="rounded-lg border border-line bg-white p-2 text-navy-950" aria-expanded={open} aria-label={open ? t.nav.close : t.nav.menu}>
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col py-4">
            {pages.map((p) => (
              <NavLink key={p} to={href(lang, p)} className={({ isActive }) => `border-b border-line py-3.5 text-base font-medium ${isActive ? 'text-navy-950' : 'text-ink/70'}`}>{t.nav[p]}</NavLink>
            ))}
            <Button to={href(lang, 'contact')} className="mt-5" arrow>{t.nav.cta}</Button>
          </Container>
        </div>
      )}
    </header>
  );
}

function Footer() {
  const { lang, t } = useI18n();
  return (
    <footer className="bg-navy-950 text-white/70">
      <Container className="grid gap-10 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo lang={lang} dark />
          <p className="mt-5 max-w-sm text-sm leading-relaxed">{t.footer.tagline}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm"><MapPin size={15} className="text-accent" aria-hidden="true" />{site.city}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">{t.footer.pages}</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {['home', ...pages].map((p) => <li key={p}><Link to={href(lang, p)} className="transition hover:text-white">{t.nav[p]}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-white/40">{t.footer.contact}</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 transition hover:text-white"><Mail size={15} aria-hidden="true" />{site.email}</a></li>
            <li><a href={whatsappLink(t.contact.whatsappText)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition hover:text-white"><MessageCircle size={15} aria-hidden="true" />WhatsApp</a></li>
            <li><a href={site.linkedin} target="_blank" rel="noopener" className="inline-flex items-center gap-2 transition hover:text-white"><Linkedin size={15} aria-hidden="true" />LinkedIn</a></li>
            <li><a href={site.cv} download className="inline-flex items-center gap-2 transition hover:text-white"><Download size={15} aria-hidden="true" />{t.common.downloadCv}</a></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col justify-between gap-2 py-6 text-xs text-white/40 sm:flex-row">
          <span>© {new Date().getFullYear()} Miriam ANIBABA. {t.footer.rights}</span>
          <span>Cotonou · Bénin</span>
        </Container>
      </div>
    </footer>
  );
}

export default function Layout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-ink antialiased">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:text-navy-950">Aller au contenu</a>
      <Navbar />
      <main id="contenu" className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
