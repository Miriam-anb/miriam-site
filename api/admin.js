import crypto from 'node:crypto';

// API de l'espace admin (/espace-miriam).
// Variables Vercel : ADMIN_PASSWORD, GITHUB_TOKEN (accès « Contents : Read and write » au dépôt),
// GITHUB_REPO (facultatif, par défaut Miriam-anb/miriam-site), GITHUB_BRANCH (facultatif, par défaut main).

const REPO = process.env.GITHUB_REPO || 'Miriam-anb/miriam-site';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const FILES = { projects: 'src/content/projects.json', parcours: 'src/content/parcours.json' };
const TOKEN_HOURS = 8;

const sign = (data) => crypto.createHmac('sha256', process.env.ADMIN_PASSWORD).update(data).digest('hex');
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)); const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
const makeToken = () => { const exp = String(Date.now() + TOKEN_HOURS * 3600e3); return `${exp}.${sign(exp)}`; };
const validToken = (t = '') => {
  const [exp, sig] = String(t).split('.');
  return exp && sig && Number(exp) > Date.now() && safeEqual(sig, sign(exp));
};

async function gh(path, opts = {}) {
  const r = await fetch(`https://api.github.com/repos/${REPO}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}`, Accept: 'application/vnd.github+json', 'User-Agent': 'miriam-site-admin', ...(opts.body ? { 'Content-Type': 'application/json' } : {}) },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`GitHub ${r.status} : ${data.message || 'erreur'}`);
  return data;
}

async function readFile(path) {
  const d = await gh(`/contents/${path}?ref=${BRANCH}`);
  return JSON.parse(Buffer.from(d.content, 'base64').toString('utf8'));
}

// Un seul commit pour le JSON et les nouvelles images : une seule mise en ligne
async function commit(files, message) {
  const ref = await gh(`/git/ref/heads/${BRANCH}`);
  const head = await gh(`/git/commits/${ref.object.sha}`);
  const tree = [];
  for (const f of files) {
    const blob = await gh('/git/blobs', { method: 'POST', body: JSON.stringify({ content: f.base64, encoding: 'base64' }) });
    tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const newTree = await gh('/git/trees', { method: 'POST', body: JSON.stringify({ base_tree: head.tree.sha, tree }) });
  const c = await gh('/git/commits', { method: 'POST', body: JSON.stringify({ message, tree: newTree.sha, parents: [head.sha] }) });
  await gh(`/git/refs/heads/${BRANCH}`, { method: 'PATCH', body: JSON.stringify({ sha: c.sha }) });
  return c.sha;
}

const validImagePath = (p) => /^public\/projects\/[a-z0-9-]+\.(jpg|jpeg|png|webp)$/.test(p);

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });
  if (!process.env.ADMIN_PASSWORD || !process.env.GITHUB_TOKEN) {
    return res.status(500).json({ error: 'Espace admin non configuré : ajoutez ADMIN_PASSWORD et GITHUB_TOKEN dans Vercel.' });
  }
  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  try {
    if (body.action === 'login') {
      await new Promise((r) => setTimeout(r, 400)); // ralentit les essais de mot de passe
      if (!safeEqual(body.password || '', process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: 'Mot de passe incorrect' });
      return res.status(200).json({ token: makeToken() });
    }

    if (!validToken(req.headers['x-admin-token'])) return res.status(401).json({ error: 'Session expirée, reconnectez-vous.' });

    if (body.action === 'load') {
      const [projects, parcours] = await Promise.all([readFile(FILES.projects), readFile(FILES.parcours)]);
      return res.status(200).json({ projects, parcours });
    }

    if (body.action === 'save') {
      const path = FILES[body.file];
      if (!path || !Array.isArray(body.data)) return res.status(400).json({ error: 'Données invalides' });
      const images = Array.isArray(body.images) ? body.images : [];
      if (images.length > 20 || images.some((i) => !validImagePath(i.path) || typeof i.base64 !== 'string')) {
        return res.status(400).json({ error: 'Image invalide' });
      }
      const json = JSON.stringify(body.data, null, 2) + '\n';
      const files = [...images, { path, base64: Buffer.from(json, 'utf8').toString('base64') }];
      const label = body.file === 'projects' ? 'des réalisations' : 'du parcours';
      const sha = await commit(files, `Mise à jour ${label} depuis l'espace admin`);
      return res.status(200).json({ ok: true, sha });
    }

    return res.status(400).json({ error: 'Action inconnue' });
  } catch (e) {
    console.error('admin:', e.message);
    return res.status(502).json({ error: e.message });
  }
}
