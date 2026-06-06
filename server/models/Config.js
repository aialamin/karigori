import mongoose from 'mongoose';

/* Singleton config document — admin-managed extras */
const configSchema = new mongoose.Schema({
  _id:  { type: String, default: 'main' },

  /* Extra categories beyond the 8 built-ins */
  extraCategories: [{
    key:      { type: String, required: true },
    label:    { type: String, required: true },
    labelBn:  { type: String, default: '' },
    color:    { type: String, default: '#006A4E' },
    bg:       { type: String, default: '#e6f4ef' },
    iconName: { type: String, default: 'Wrench' },  // Lucide icon component name
  }],

  /* Extra areas/districts beyond the Bangladesh defaults */
  extraAreas: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Config', configSchema);
