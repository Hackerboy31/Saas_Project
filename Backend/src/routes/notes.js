const express = require('express');
const router = express.Router();
const prisma = require('../Utils/prismaClient');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { title, body } = req.body;
  const tenant = await prisma.tenant.findUnique({ where: { id: req.user.tenantId } });

  if (tenant.plan === 'FREE') {
    const count = await prisma.note.count({ where: { tenantId: tenant.id } });
    if (count >= 3) return res.status(403).json({ error: 'note limit reached', canUpgrade: true });
  }

  const note = await prisma.note.create({ data: { title, body, tenantId: tenant.id } });
  res.status(201).json(note);
});

router.get('/', auth, async (req, res) => {
  const notes = await prisma.note.findMany({ where: { tenantId: req.user.tenantId } });
  res.json(notes);
});

router.get('/:id', auth, async (req, res) => {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });
  if (!note || note.tenantId !== req.user.tenantId) return res.status(404).json({ error: 'Not found' });
  res.json(note);
});

router.put('/:id', auth, async (req, res) => {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });
  if (!note || note.tenantId !== req.user.tenantId) return res.status(404).json({ error: 'Not found' });

  const updated = await prisma.note.update({ where: { id: note.id }, data: { title: req.body.title, body: req.body.body } });
  res.json(updated);
});

router.delete('/:id', auth, async (req, res) => {
  const note = await prisma.note.findUnique({ where: { id: req.params.id } });
  if (!note || note.tenantId !== req.user.tenantId) return res.status(404).json({ error: 'Not found' });

  await prisma.note.delete({ where: { id: note.id } });
  res.json({ success: true });
});

module.exports = router;
