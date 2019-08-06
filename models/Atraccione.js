const mongoose = require('mongoose');
const { Schema } = mongoose;

const AtraccioneSchema = new Schema({
  title: {type: String},
  description: {type: String},
  place: {type: String},
  filename: {type: String},
  path: {type: String},
  originalname: {type: String},
  mimetype: {type: String},
  size: { type: Number},
  created_at: {type: Date, default: Date.now()},
  user: {
    type: String,
    required: true
  }
  
});

module.exports = mongoose.model('Atraccione', AtraccioneSchema);
