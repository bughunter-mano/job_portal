const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    logo: { type: String }, // path/URL to logo image
    about: { type: String },
    order: { type: Number, default: 0 }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Client', clientSchema);
