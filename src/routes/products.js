const router = require('express').Router();
const prisma = require('../prisma');
const auth = require('../middleware/auth');

// Public
router.get('/', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.params.id } });
  p ? res.json(p) : res.status(404).json({ error: 'Introuvable' });
});

// Admin uniquement
router.post('/', auth, async (req, res) => {
  try {
    const p = await prisma.product.create({ data: req.body });
    res.json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...data } = req.body;
    const p = await prisma.product.update({ where: { id: req.params.id }, data });
    res.json(p);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

module.exports = router;