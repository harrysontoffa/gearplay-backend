const router = require('express').Router();
const prisma = require('../prisma');

router.get('/', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const p = await prisma.product.findUnique({ where: { id: req.params.id } });
  p ? res.json(p) : res.status(404).json({ error: 'Introuvable' });
});

module.exports = router;