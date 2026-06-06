import express from 'express';
import Config from '../models/Config.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreate() {
  let c = await Config.findById('main');
  if (!c) c = await Config.create({ _id: 'main', extraCategories: [], extraAreas: [] });
  return c;
}

/* ── Public ─────────────────────────────────────────────────────── */

// GET /api/config  — extra categories + extra areas
router.get('/', async (req, res) => {
  try {
    const c = await getOrCreate();
    res.json({ extraCategories: c.extraCategories, extraAreas: c.extraAreas });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

/* ── Admin ──────────────────────────────────────────────────────── */

// POST /api/config/categories — add a category
router.post('/categories', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { key, label, labelBn, color, bg, iconName } = req.body;
    if (!key?.trim() || !label?.trim())
      return res.status(400).json({ message: 'key and label are required' });

    const c = await getOrCreate();
    if (c.extraCategories.find((x) => x.key === key.trim()))
      return res.status(400).json({ message: 'Category key already exists' });

    c.extraCategories.push({ key: key.trim(), label: label.trim(), labelBn: labelBn || label.trim(), color: color || '#006A4E', bg: bg || '#e6f4ef', iconName: iconName || 'Wrench' });
    await c.save();
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/config/categories/:key — remove a category
router.delete('/categories/:key', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const c = await getOrCreate();
    c.extraCategories = c.extraCategories.filter((x) => x.key !== req.params.key);
    await c.save();
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/config/areas — add an area
router.post('/areas', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { area } = req.body;
    if (!area?.trim()) return res.status(400).json({ message: 'area is required' });

    const c = await getOrCreate();
    if (c.extraAreas.includes(area.trim()))
      return res.status(400).json({ message: 'Area already exists' });

    c.extraAreas.push(area.trim());
    await c.save();
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/config/areas — remove an area
router.delete('/areas', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const { area } = req.body;
    const c = await getOrCreate();
    c.extraAreas = c.extraAreas.filter((a) => a !== area);
    await c.save();
    res.json(c);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
