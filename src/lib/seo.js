import { useEffect } from 'react';
import { site } from '../data/site.js';
import { href, languages } from '../i18n/index.jsx';

const setMeta = (selector, attr, value) => {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta');
    const m = selector.match(/\[(\w+(?:-\w+)?)="([^"]+)"\]/g) || [];
    m.forEach((part) => {
      const [, k, v] = part.match(/\[([\w-]+)="([^"]+)"\]/);
      el.setAttribute(k, v);
    });
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

// Titre, description et liens de langue de chaque page
export function useSeo(meta, lang, page) {
  useEffect(() => {
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description || '');
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description || '');
    setMeta('meta[property="og:locale"]', 'content', lang === 'fr' ? 'fr_FR' : 'en_US');
    if (page) {
      setMeta('link[rel="canonical"]', 'href', site.url + href(lang, page));
      languages.forEach((l) => setMeta(`link[rel="alternate"][hreflang="${l}"]`, 'href', site.url + href(l, page)));
    }
  }, [meta, lang, page]);
}
