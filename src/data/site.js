// Coordonnées et liens — à modifier ici, ils sont utilisés partout sur le site.
export const site = {
  name: 'Miriam ANIBABA',
  url: 'https://miriam-anibaba.vercel.app', // à remplacer par l'adresse définitive du site
  email: 'anibabamiriam@gmail.com',
  phoneDisplay: '+229 01 57 96 00 97',
  whatsapp: '2290157960097', // numéro WhatsApp au format international, sans + ni espaces
  linkedin: 'https://www.linkedin.com/in/miriam-anibaba-a3965132a/',
  cv: '/cv/Miriam-ANIBABA-CV.pdf',
  city: 'Cotonou, Bénin',
};

export const whatsappLink = (text = '') =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
