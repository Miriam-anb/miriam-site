import { createContext, useContext, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import fr from './fr.js';
import en from './en.js';

export const dictionaries = { fr, en };
export const languages = ['fr', 'en'];

// Adresse de chaque page dans chaque langue
export const paths = {
  home: { fr: '', en: '' },
  services: { fr: 'services', en: 'services' },
  solutions: { fr: 'solutions', en: 'solutions' },
  projects: { fr: 'realisations', en: 'work' },
  about: { fr: 'a-propos', en: 'about' },
  contact: { fr: 'contact', en: 'contact' },
};

export const pageFromSlug = (lang, slug = '') =>
  Object.keys(paths).find((k) => paths[k][lang] === slug) ?? null;

export const href = (lang, page, hash = '') => `/${lang}${paths[page][lang] ? `/${paths[page][lang]}` : ''}${hash}`;

const I18nContext = createContext({ lang: 'fr', t: fr });

export function I18nProvider({ children }) {
  const { lang: raw } = useParams();
  const lang = languages.includes(raw) ? raw : 'fr';
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return <I18nContext.Provider value={{ lang, t: dictionaries[lang] }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

// Même page dans l'autre langue
export function useSwitchHref() {
  const { lang } = useI18n();
  const { pathname, hash } = useLocation();
  const slug = pathname.split('/')[2] ?? '';
  const page = pageFromSlug(lang, slug) ?? 'home';
  const other = lang === 'fr' ? 'en' : 'fr';
  return { other, to: href(other, page) + (hash || '') };
}
