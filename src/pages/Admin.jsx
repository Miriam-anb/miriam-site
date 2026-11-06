import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, Check, ChevronLeft, ImagePlus, Loader2, LogOut, Pencil, Plus, Save, Trash2, X } from 'lucide-react';

// Espace admin caché : /espace-miriam (aucun lien sur le site, protégé par mot de passe)

const api = async (body, token) => {
  const r = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { 'x-admin-token': token } : {}) },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(data.error || 'Erreur'), { status: r.status });
  return data;
};

const getToken = () => { try { return sessionStorage.getItem('ma-admin') || ''; } catch { return ''; } };
const setToken = (t) => { try { t ? sessionStorage.setItem('ma-admin', t) : sessionStorage.removeItem('ma-admin'); } catch { /* ignore */ } };

const slugify = (s) => (s || 'projet').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'projet';
const lines = (arr) => (arr || []).join('\n');
const toLines = (txt) => txt.split('\n').map((l) => l.trim()).filter(Boolean);

// Réduit l'image dans le navigateur (JPEG, 1600 px max) avant l'envoi
const compress = (file) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => {
    const scale = Math.min(1, 1600 / img.width);
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    resolve(c.toDataURL('image/jpeg', 0.85));
    URL.revokeObjectURL(img.src);
  };
  img.onerror = reject;
  img.src = URL.createObjectURL(file);
});

const field = 'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-navy-600 focus:ring-4 focus:ring-navy-600/10';
const Label = ({ children, hint }) => <span className="text-[13px] font-semibold text-navy-950">{children}{hint && <span className="ml-1 font-normal text-ink/45">{hint}</span>}</span>;
const Input = ({ label, hint, value, onChange, ...rest }) => (
  <label className="block"><Label hint={hint}>{label}</Label><input className={field} value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...rest} /></label>
);
const Area = ({ label, hint, value, onChange, rows = 4 }) => (
  <label className="block"><Label hint={hint}>{label}</Label><textarea className={field} rows={rows} value={value ?? ''} onChange={(e) => onChange(e.target.value)} /></label>
);
const Btn = ({ children, variant = 'dark', className = '', ...rest }) => {
  const v = { dark: 'bg-navy-950 text-white hover:bg-navy-800', accent: 'bg-accent text-navy-950 hover:bg-[#d4f562]', light: 'border border-line bg-white text-navy-950 hover:border-navy-900/30', danger: 'border border-red-200 bg-white text-red-600 hover:bg-red-50' }[variant];
  return <button type="button" className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 ${v} ${className}`} {...rest}>{children}</button>;
};
const LangCol = ({ lang, children }) => (
  <div className="space-y-4 rounded-2xl border border-line bg-mist/60 p-4">
    <p className="text-xs font-bold uppercase tracking-[.14em] text-navy-600">{lang === 'fr' ? 'Français' : 'Anglais'}</p>
    {children}
  </div>
);

/* ---------- Connexion ---------- */
function Login({ onLogged }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const { token } = await api({ action: 'login', password }); setToken(token); onLogged(token); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-[24px] bg-white p-8">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-950 font-serif text-xl italic text-accent">ma</span>
        <h1 className="mt-5 text-2xl font-bold text-navy-950">Espace admin</h1>
        <p className="mt-1 text-sm text-ink/60">Réalisations et parcours du site.</p>
        <label className="mt-6 block"><Label>Mot de passe</Label>
          <input type="password" autoComplete="current-password" className={field} value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </label>
        {error && <p className="mt-3 text-sm text-red-600" role="alert">{error}</p>}
        <Btn type="submit" variant="accent" className="mt-6 w-full justify-center" disabled={busy || !password}>
          {busy ? <Loader2 size={16} className="animate-spin" /> : null}Se connecter
        </Btn>
      </form>
    </div>
  );
}

/* ---------- Images (principale + galerie) ---------- */
function Images({ project, setProject, pending, setPending }) {
  const all = [project.image, ...(project.gallery || [])].filter(Boolean);
  const src = (u) => pending[u]?.dataUrl || u;
  const update = (list) => setProject({ ...project, image: list[0] || '', gallery: list.slice(1) });
  const add = async (files) => {
    const next = [...all]; const p = { ...pending };
    for (const f of files) {
      const dataUrl = await compress(f);
      const name = `${slugify(project.slug)}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
      const url = `/projects/${name}.jpg`;
      p[url] = { dataUrl, path: `public${url}` };
      next.push(url);
    }
    setPending(p); update(next);
  };
  const move = (i, d) => { const n = [...all]; [n[i], n[i + d]] = [n[i + d], n[i]]; update(n); };
  return (
    <div>
      <Label hint="(la première est l'image principale)">Captures</Label>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {all.map((u, i) => (
          <div key={u} className="group relative overflow-hidden rounded-xl border border-line bg-mist">
            <img src={src(u)} alt="" className="aspect-[16/10] w-full object-cover object-top" />
            {i === 0 && <span className="absolute left-2 top-2 rounded-md bg-navy-950 px-2 py-0.5 text-[10px] font-bold text-accent">PRINCIPALE</span>}
            <div className="flex justify-between gap-1 border-t border-line bg-white p-1.5">
              <div className="flex gap-1">
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded-md p-1 hover:bg-mist disabled:opacity-30" aria-label="Avancer"><ChevronLeft size={15} /></button>
                <button type="button" disabled={i === all.length - 1} onClick={() => move(i, 1)} className="rotate-180 rounded-md p-1 hover:bg-mist disabled:opacity-30" aria-label="Reculer"><ChevronLeft size={15} /></button>
              </div>
              <button type="button" onClick={() => update(all.filter((x) => x !== u))} className="rounded-md p-1 text-red-600 hover:bg-red-50" aria-label="Retirer"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
        <label className="flex aspect-[16/10] cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-line text-sm text-ink/55 transition hover:border-navy-600 hover:text-navy-900">
          <ImagePlus size={20} />Ajouter
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { add([...e.target.files]); e.target.value = ''; }} />
        </label>
      </div>
    </div>
  );
}

/* ---------- Éditeur de réalisation ---------- */
const emptyProject = () => ({ slug: '', category: 'ai', image: '', gallery: [], visual: 'grid', demo: '', client: false, stack: [],
  fr: { name: '', description: '', problem: '', role: '', features: [] }, en: { name: '', description: '', problem: '', role: '', features: [] } });

function ProjectEditor({ initial, onCancel, onDone, pending, setPending }) {
  const [p, setP] = useState(() => JSON.parse(JSON.stringify(initial)));
  const setL = (lang, k, v) => setP({ ...p, [lang]: { ...p[lang], [k]: v } });
  const valid = p.fr.name.trim() && p.en.name.trim();
  const done = () => {
    const out = { ...p, slug: p.slug || slugify(p.fr.name) };
    ['fr', 'en'].forEach((l) => { if (!out[l].role) delete out[l].role; });
    if (!out.client) delete out.client;
    onDone(out);
  };
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block"><Label>Catégorie</Label>
          <select className={field} value={p.category} onChange={(e) => setP({ ...p, category: e.target.value })}>
            <option value="ai">IA & automatisation</option><option value="web">Développement web</option>
          </select>
        </label>
        <Input label="Lien de démo" hint="(facultatif)" value={p.demo} onChange={(v) => setP({ ...p, demo: v })} placeholder="https://…" />
        <label className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-navy-950">
          <input type="checkbox" className="h-4 w-4 accent-[#0A1730]" checked={!!p.client} onChange={(e) => setP({ ...p, client: e.target.checked })} />Projet client
        </label>
      </div>
      <Input label="Technologies" hint="(séparées par des virgules)" value={(p.stack || []).join(', ')} onChange={(v) => setP({ ...p, stack: v.split(',').map((s) => s.trim()).filter(Boolean) })} />
      <Images project={p} setProject={setP} pending={pending} setPending={setPending} />
      <div className="grid gap-4 lg:grid-cols-2">
        {['fr', 'en'].map((l) => (
          <LangCol key={l} lang={l}>
            <Input label="Nom du projet" value={p[l].name} onChange={(v) => setL(l, 'name', v)} />
            <Area label="Description" rows={3} value={p[l].description} onChange={(v) => setL(l, 'description', v)} />
            <Area label="Problème résolu" rows={2} value={p[l].problem} onChange={(v) => setL(l, 'problem', v)} />
            <Area label="Mon rôle" hint="(facultatif)" rows={2} value={p[l].role} onChange={(v) => setL(l, 'role', v)} />
            <Area label="Fonctionnalités" hint="(une par ligne)" rows={6} value={lines(p[l].features)} onChange={(v) => setL(l, 'features', toLines(v))} />
          </LangCol>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Btn variant="accent" onClick={done} disabled={!valid}><Check size={16} />Valider ce projet</Btn>
        <Btn variant="light" onClick={onCancel}>Annuler</Btn>
        {!valid && <p className="self-center text-sm text-ink/55">Le nom du projet est requis en français et en anglais.</p>}
      </div>
    </div>
  );
}

/* ---------- Éditeur de parcours ---------- */
const emptyStep = () => ({ id: `p${Date.now().toString(36)}`, link: false, education: false, stack: '',
  fr: { period: '', role: '', place: '', items: [], groups: [] }, en: { period: '', role: '', place: '', items: [], groups: [] } });

function StepEditor({ initial, onCancel, onDone }) {
  const [s, setS] = useState(() => JSON.parse(JSON.stringify(initial)));
  const setL = (lang, k, v) => setS({ ...s, [lang]: { ...s[lang], [k]: v } });
  const setGroup = (lang, i, k, v) => { const g = [...s[lang].groups]; g[i] = { ...g[i], [k]: v }; setL(lang, 'groups', g); };
  const addGroup = () => setS({ ...s, fr: { ...s.fr, groups: [...s.fr.groups, { title: '', items: [] }] }, en: { ...s.en, groups: [...s.en.groups, { title: '', items: [] }] } });
  const removeGroup = (i) => setS({ ...s, fr: { ...s.fr, groups: s.fr.groups.filter((_, j) => j !== i) }, en: { ...s.en, groups: s.en.groups.filter((_, j) => j !== i) } });
  const valid = s.fr.role.trim() && s.en.role.trim() && s.fr.period.trim();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="Technologies" hint="(facultatif)" value={s.stack} onChange={(v) => setS({ ...s, stack: v })} />
        <label className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-navy-950">
          <input type="checkbox" className="h-4 w-4 accent-[#0A1730]" checked={s.link} onChange={(e) => setS({ ...s, link: e.target.checked })} />Lien « Voir les réalisations »
        </label>
        <label className="mt-6 flex items-center gap-2.5 text-sm font-semibold text-navy-950">
          <input type="checkbox" className="h-4 w-4 accent-[#0A1730]" checked={s.education} onChange={(e) => setS({ ...s, education: e.target.checked })} />C'est une formation
        </label>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {['fr', 'en'].map((l) => (
          <LangCol key={l} lang={l}>
            <Input label="Période" value={s[l].period} onChange={(v) => setL(l, 'period', v)} placeholder={l === 'fr' ? 'Mai – octobre 2026' : 'May – October 2026'} />
            <Input label="Intitulé" value={s[l].role} onChange={(v) => setL(l, 'role', v)} />
            <Input label="Lieu / type" hint="(facultatif)" value={s[l].place} onChange={(v) => setL(l, 'place', v)} />
            <Area label="Points" hint="(un par ligne)" rows={5} value={lines(s[l].items)} onChange={(v) => setL(l, 'items', toLines(v))} />
            {s[l].groups.map((g, i) => (
              <div key={i} className="space-y-3 rounded-xl border border-line bg-white p-3">
                <Input label={`Bloc ${i + 1} — titre`} value={g.title} onChange={(v) => setGroup(l, i, 'title', v)} />
                <Area label="Points du bloc" hint="(un par ligne)" rows={4} value={lines(g.items)} onChange={(v) => setGroup(l, i, 'items', toLines(v))} />
              </div>
            ))}
          </LangCol>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Btn variant="light" onClick={addGroup}><Plus size={16} />Ajouter un bloc</Btn>
        {s.fr.groups.length > 0 && <Btn variant="danger" onClick={() => removeGroup(s.fr.groups.length - 1)}><Trash2 size={16} />Retirer le dernier bloc</Btn>}
      </div>
      <div className="flex flex-wrap gap-3">
        <Btn variant="accent" onClick={() => onDone(s)} disabled={!valid}><Check size={16} />Valider cette étape</Btn>
        <Btn variant="light" onClick={onCancel}>Annuler</Btn>
        {!valid && <p className="self-center text-sm text-ink/55">Période et intitulé requis.</p>}
      </div>
    </div>
  );
}

/* ---------- Liste réordonnable ---------- */
function ItemList({ items, title, sub, onEdit, onMove, onDelete }) {
  return (
    <ul className="space-y-2">
      {items.map((it, i) => (
        <li key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3">
          <div className="flex flex-col">
            <button type="button" disabled={i === 0} onClick={() => onMove(i, -1)} className="rounded p-0.5 hover:bg-mist disabled:opacity-25" aria-label="Monter"><ArrowUp size={15} /></button>
            <button type="button" disabled={i === items.length - 1} onClick={() => onMove(i, 1)} className="rounded p-0.5 hover:bg-mist disabled:opacity-25" aria-label="Descendre"><ArrowDown size={15} /></button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-navy-950">{title(it)}</p>
            <p className="truncate text-sm text-ink/55">{sub(it)}</p>
          </div>
          <Btn variant="light" onClick={() => onEdit(i)} className="!px-3"><Pencil size={15} /><span className="hidden sm:inline">Modifier</span></Btn>
          <Btn variant="danger" onClick={() => onDelete(i)} className="!px-3" aria-label="Supprimer"><Trash2 size={15} /></Btn>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Page ---------- */
export default function Admin() {
  const [token, setTok] = useState(getToken);
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('projects');
  const [editing, setEditing] = useState(null); // { index } ; index = -1 pour un ajout
  const [pending, setPending] = useState({});
  const [dirty, setDirty] = useState({ projects: false, parcours: false });
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    document.title = 'Espace admin — Miriam ANIBABA';
    let m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    m.content = 'noindex, nofollow';
  }, []);

  useEffect(() => {
    if (!token) return;
    api({ action: 'load' }, token).then(setData).catch((e) => {
      if (e.status === 401) { setToken(''); setTok(''); } else setStatus({ type: 'error', text: e.message });
    });
  }, [token]);

  useEffect(() => {
    const warn = (e) => { if (dirty.projects || dirty.parcours) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const list = data?.[tab] || [];
  const setList = (next) => { setData({ ...data, [tab]: next }); setDirty({ ...dirty, [tab]: true }); setStatus(null); };
  const move = (i, d) => { const n = [...list]; [n[i], n[i + d]] = [n[i + d], n[i]]; setList(n); };
  const remove = (i) => { if (window.confirm('Supprimer cet élément ? (définitif après « Enregistrer »)')) setList(list.filter((_, j) => j !== i)); };
  const done = (item) => { const n = [...list]; editing.index === -1 ? n.unshift(item) : (n[editing.index] = item); setList(n); setEditing(null); };

  const usedPending = useMemo(() => {
    if (tab !== 'projects' || !data) return [];
    const urls = new Set(data.projects.flatMap((p) => [p.image, ...(p.gallery || [])]));
    return Object.entries(pending).filter(([u]) => urls.has(u)).map(([, v]) => ({ path: v.path, base64: v.dataUrl.split(',')[1] }));
  }, [pending, data, tab]);

  const save = async () => {
    setBusy(true); setStatus(null);
    try {
      await api({ action: 'save', file: tab, data: list, images: usedPending }, token);
      setDirty({ ...dirty, [tab]: false });
      setStatus({ type: 'ok', text: 'Enregistré ! Le site en ligne sera mis à jour dans 1 à 2 minutes.' });
    } catch (e) {
      if (e.status === 401) { setToken(''); setTok(''); }
      setStatus({ type: 'error', text: e.message });
    } finally { setBusy(false); }
  };

  if (!token) return <Login onLogged={setTok} />;

  const tabs = [['projects', 'Réalisations'], ['parcours', 'Parcours']];
  return (
    <div className="min-h-screen bg-mist font-sans text-ink">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-navy-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 font-serif text-lg italic text-accent">ma</span>
            <p className="font-bold text-white">Espace admin</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/fr" target="_blank" rel="noopener" className="rounded-xl px-3 py-2 text-sm font-medium text-white/70 hover:text-white">Voir le site</a>
            <button type="button" onClick={() => { setToken(''); setTok(''); setData(null); }} className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-sm font-medium text-white/80 hover:text-white"><LogOut size={15} />Quitter</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {!data ? (
          status ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{status.text}</p>
            : <p className="flex items-center gap-2 text-ink/60"><Loader2 size={18} className="animate-spin" />Chargement…</p>
        ) : editing ? (
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-8">
            <h1 className="mb-6 text-2xl font-bold text-navy-950">
              {editing.index === -1 ? 'Ajouter' : 'Modifier'} {tab === 'projects' ? 'une réalisation' : 'une étape du parcours'}
            </h1>
            {tab === 'projects'
              ? <ProjectEditor initial={editing.index === -1 ? emptyProject() : list[editing.index]} onCancel={() => setEditing(null)} onDone={done} pending={pending} setPending={setPending} />
              : <StepEditor initial={editing.index === -1 ? emptyStep() : list[editing.index]} onCancel={() => setEditing(null)} onDone={done} />}
          </section>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-1 rounded-xl border border-line bg-white p-1">
                {tabs.map(([k, label]) => (
                  <button key={k} type="button" onClick={() => { setTab(k); setStatus(null); }}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${tab === k ? 'bg-navy-950 text-white' : 'text-ink/60 hover:text-navy-950'}`}>
                    {label}{dirty[k] && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-amber-400 align-middle" title="Modifications non enregistrées" />}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn variant="light" onClick={() => setEditing({ index: -1 })}><Plus size={16} />Ajouter</Btn>
                <Btn variant="accent" onClick={save} disabled={busy || !dirty[tab]}>
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}Enregistrer
                </Btn>
              </div>
            </div>

            {status && (
              <p className={`mt-5 flex items-start gap-2 rounded-xl p-4 text-sm ${status.type === 'ok' ? 'bg-accent-soft text-navy-900' : 'bg-red-50 text-red-700'}`} role="status">
                {status.type === 'ok' ? <Check size={18} className="shrink-0" /> : <X size={18} className="shrink-0" />}{status.text}
              </p>
            )}
            {dirty[tab] && !status && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">Modifications non enregistrées : cliquez sur « Enregistrer » pour les publier.</p>}

            <div className="mt-6">
              {tab === 'projects'
                ? <ItemList items={list} title={(p) => p.fr.name} sub={(p) => `${p.category === 'ai' ? 'IA & automatisation' : 'Développement web'}${p.client ? ' · Projet client' : ''} · ${[p.image, ...(p.gallery || [])].filter(Boolean).length} capture(s)`} onEdit={(i) => setEditing({ index: i })} onMove={move} onDelete={remove} />
                : <ItemList items={list} title={(s) => s.fr.role} sub={(s) => `${s.fr.period}${s.fr.place ? ' · ' + s.fr.place : ''}`} onEdit={(i) => setEditing({ index: i })} onMove={move} onDelete={remove} />}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
