const express = require('express');
const router = express.Router();
const prisma = require('../Utils/prismaClient');
const auth = require('../middleware/auth');

router.post('/:slug/upgrade', auth, async (req, res) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  const tenant = await prisma.tenant.findUnique({ where: { slug: req.params.slug } });
  if (!tenant || tenant.id !== req.user.tenantId) return res.status(403).json({ error: 'Not allowed' });

  const updated = await prisma.tenant.update({ where: { id: tenant.id }, data: { plan: 'PRO' } });
  res.json(updated);
});

module.exports = router;
