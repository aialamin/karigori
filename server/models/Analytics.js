import mongoose from 'mongoose';

/* One document per day */
const analyticsSchema = new mongoose.Schema({
  date:       { type: String, required: true, unique: true }, // YYYY-MM-DD
  pageViews:  { type: Number, default: 0 },
  uniqueIPs:  [{ type: String }],           // raw IPs for unique count
  phoneClicks: { type: Number, default: 0 },
  searches:   { type: Number, default: 0 },
  workerViews: { type: Number, default: 0 },
}, { timestamps: false });

export default mongoose.model('Analytics', analyticsSchema);
