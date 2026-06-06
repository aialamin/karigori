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

  /* Admin notice — shown as modal on first load */
  notice: {
    active:   { type: Boolean, default: false },
    title:    { type: String,  default: '' },
    subtitle: { type: String,  default: '' },
    message:  { type: String,  default: '' },
    type:     { type: String,  default: 'info', enum: ['info','warning','success','urgent'] },
  },
}, { timestamps: true });

export default mongoose.model('Config', configSchema);
