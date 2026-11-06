import { href, useI18n } from '../i18n/index.jsx';
import { useSeo } from '../lib/seo.js';
import { Button, Container } from '../components/ui.jsx';

export default function NotFound() {
  const { lang, t } = useI18n();
  useSeo(t.meta.notFound, lang, 'home');
  return (
    <section className="py-32">
      <Container className="text-center">
        <p className="font-display text-8xl font-bold text-navy-900/15">404</p>
        <h1 className="mt-4 text-3xl font-bold text-navy-950">{t.notFound.title}</h1>
        <div className="mt-8"><Button to={href(lang, 'home')} variant="dark" arrow>{t.notFound.back}</Button></div>
      </Container>
    </section>
  );
}
