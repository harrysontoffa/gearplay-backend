const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// POST /api/orders — publique (créée par le tunnel de paiement)
router.post('/', async (req, res) => {
  try {
    const { id, email, name, address, lines, subtotal, discount, shipping, total, status, stripePi, promoCode } = req.body;

    // Transaction : créer la commande + décrémenter le stock atomiquement
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: { id, email, name, address, lines, subtotal, discount: discount||0, shipping: shipping||0, total, status: status||'confirmée', stripePi, promoCode }
      });
      // Décrément stock
      for (const line of (lines || [])) {
        const p = await tx.product.findUnique({ where: { id: line.id } });
        if (!p) continue;
        const newStock = Math.max(0, (p.stockN || 0) - (line.qty || 0));
        await tx.product.update({
          where: { id: line.id },
          data: { stockN: newStock, inStock: newStock > 0 }
        });
      }
      return created;
    });
    res.json(order);
  } catch (e) {
    console.error('POST /orders:', e);
    res.status(400).json({ error: e.message });
  }
});

// GET /api/orders — admin uniquement
router.get('/', auth, async (req, res) => {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(orders);
});

// GET /api/orders/lookup?id=X&email=Y — public, pour la page suivi
router.get('/lookup', async (req, res) => {
  const { id, email } = req.query;
  if (!id || !email) return res.status(400).json({ error: 'id et email requis' });
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || order.email.toLowerCase() !== email.toLowerCase()) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }
  res.json(order);
});

module.exports = router;