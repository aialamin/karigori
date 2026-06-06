import express from 'express';
import Analytics from '../models/Analytics.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = express.Router();

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/* ── Public track events ── */

// POST /api/analytics/track  { event: 'pageview'|'phone_click'|'search'|'worker_view', ip }
router.post('/track', async (req, res) => {
  try {
    const { event } = req.body;
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const date = todayStr();

    const inc = {};
    if (event === 'pageview')     inc.pageViews   = 1;
    if (event === 'phone_click')  inc.phoneClicks  = 1;
    if (event === 'search')       inc.searches     = 1;
    if (event === 'worker_view')  inc.workerViews  = 1;

    // Upsert today's doc, add unique IP
    await Analytics.findOneAndUpdate(
      { date },
      { $inc: inc, $addToSet: { uniqueIPs: ip } },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch { res.json({ ok: false }); }
});

/* ── Admin stats ── */

// GET /api/analytics/summary  — today + 30 days + 365 days
router.get('/summary', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const today = todayStr();
    const d30   = new Date(); d30.setDate(d30.getDate() - 30);
    const d365  = new Date(); d365.setFullYear(d365.getFullYear() - 1);
    const d30s  = d30.toISOString().slice(0, 10);
    const d365s = d365.toISOString().slice(0, 10);

    const [todayDoc, monthly, yearly] = await Promise.all([
      Analytics.findOne({ date: today }),
      Analytics.aggregate([
        { $match: { date: { $gte: d30s } } },
        { $group: { _id: null, pageViews: { $sum: '$pageViews' }, phoneClicks: { $sum: '$phoneClicks' }, searches: { $sum: '$searches' }, workerViews: { $sum: '$workerViews' }, uniqueIPs: { $push: '$uniqueIPs' } } },
      ]),
      Analytics.aggregate([
        { $match: { date: { $gte: d365s } } },
        { $group: { _id: null, pageViews: { $sum: '$pageViews' }, phoneClicks: { $sum: '$phoneClicks' }, searches: { $sum: '$searches' }, workerViews: { $sum: '$workerViews' } } },
      ]),
    ]);

    // Last 30 days chart data
    const chartData = await Analytics.find({ date: { $gte: d30s } }).sort({ date: 1 }).lean();

    const uniqueMonthly = [...new Set(monthly[0]?.uniqueIPs?.flat() || [])].length;

    res.json({
      today: {
        pageViews:   todayDoc?.pageViews   || 0,
        uniqueVisitors: todayDoc?.uniqueIPs?.length || 0,
        phoneClicks: todayDoc?.phoneClicks || 0,
        searches:    todayDoc?.searches    || 0,
        workerViews: todayDoc?.workerViews || 0,
      },
      monthly: { ...monthly[0] || {}, uniqueVisitors: uniqueMonthly },
      yearly:  yearly[0]  || {},
      chartData: chartData.map((d) => ({
        date:       d.date,
        pageViews:  d.pageViews,
        phoneClicks: d.phoneClicks,
        uniqueVisitors: d.uniqueIPs?.length || 0,
      })),
    });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
