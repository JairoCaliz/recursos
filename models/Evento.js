const mongoose = require('mongoose');
const { Schema } = mongoose;

const EventoSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  place: {
    type: String
  },
  fecha: {
    type: String
  },
  time: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Evento', EventoSchema);
