const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String }, // path/URL to project showcase image
    techStack: { type: String }, // comma-separated values, e.g. "React, Node.js, MongoDB"
    link: { type: String }, // live link or github link
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

module.exports = mongoose.model('Project', projectSchema);
