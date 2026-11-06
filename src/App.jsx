import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { I18nProvider, languages, pageFromSlug } from './i18n/index.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Solutions from './pages/Solutions.jsx';
import Projects from './pages/Projects.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';

// Espace admin caché, chargé uniquement quand on ouvre son adresse
const Admin = lazy(() => import('./pages/Admin.jsx'));

const pages = { services: Services, solutions: Solutions, projects: Projects, about: About, contact: Contact };

function Page() {
  const { lang, slug } = useParams();
  const Comp = pages[pageFromSlug(lang, slug)];
  return Comp ? <Comp /> : <NotFound />;
}

function LangGate() {
  const { lang } = useParams();
  if (!languages.includes(lang)) return <Navigate to="/fr" replace />;
  return <I18nProvider><Layout /></I18nProvider>;
}

const preferred = () => (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr');

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${preferred()}`} replace />} />
      <Route path="/espace-miriam" element={<Suspense fallback={null}><Admin /></Suspense>} />
      <Route path="/:lang" element={<LangGate />}>
        <Route index element={<Home />} />
        <Route path=":slug" element={<Page />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
