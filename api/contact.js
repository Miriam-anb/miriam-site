import nodemailer from 'nodemailer';

// Envoie la demande du formulaire de contact par e-mail (Gmail + mot de passe d'application).
// Variables Vercel : MAIL_USERNAME, MAIL_PASSWORD, CONTACT_TO (facultatif).
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const b = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // robot

  const d = {
    name: clip(b.name, 120), company: clip(b.company, 160), email: clip(b.email, 160),
    service: clip(b.serviceLabel || b.service, 160), description: clip(b.description, 5000), budget: clip(b.budget, 80), lang: b.lang === 'en' ? 'en' : 'fr',
  };
  if (!d.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email) || !d.service || d.description.length < 10) {
    return res.status(422).json({ ok: false, error: 'invalid' });
  }
  const user = process.env.MAIL_USERNAME;
  const pass = process.env.MAIL_PASSWORD;
  if (!user || !pass) return res.status(500).json({ ok: false, error: 'mail_not_configured' });

  const rows = [['Nom', d.name], ['Entreprise', d.company || '—'], ['E-mail', d.email], ['Service', d.service], ['Budget', d.budget || '—'], ['Langue', d.lang.toUpperCase()]];
  const html = `<div style="font-family:Arial,sans-serif;color:#15171C;max-width:600px">
    <h2 style="color:#0A1730">Nouvelle demande depuis le site</h2>
    <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => `<tr><td style="padding:6px 10px;background:#F4F6F9;font-weight:bold;width:120px">${k}</td><td style="padding:6px 10px">${esc(v)}</td></tr>`).join('')}</table>
    <h3 style="color:#0A1730">Description</h3><p style="white-space:pre-wrap;line-height:1.5">${esc(d.description)}</p></div>`;

  try {
    const transport = nodemailer.createTransport({ service: 'gmail', auth: { user, pass: pass.replace(/\s+/g, '') } });
    await transport.sendMail({
      from: `"Site Miriam ANIBABA" <${user}>`,
      to: process.env.CONTACT_TO || user,
      replyTo: `"${d.name.replace(/"/g, '')}" <${d.email}>`,
      subject: `Nouvelle demande — ${d.service} — ${d.name}`,
      text: rows.map(([k, v]) => `${k} : ${v}`).join('\n') + `\n\n${d.description}`,
      html,
    });
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('contact mail error:', e?.message);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
}
