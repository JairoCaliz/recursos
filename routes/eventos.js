const express = require('express');
const router = express.Router();

// Models
const Evento = require('../models/Evento');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Evento
router.get('/eventos/add', isAuthenticated, (req, res) => {
  res.render('eventos/new-evento');
});

router.post('/eventos/new-evento', isAuthenticated, async (req, res) => {
  const { title, description} = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Por favor escriba un título.'});
  }
  if (!description) {
    errors.push({text: 'Por favor escriba una descripción'});
  }
  // if (!place) {
  //   errors.push({text: 'Por favor escriba un lugar'});
  // }
  // if (!time) {
  //   errors.push({text: 'Por favor escriba una hora'});
  // }
  if (errors.length > 0) {
    res.render('eventos/new-evento', {
      errors,
      title,
      description
    });
  } else {
    const newEvento = new Evento({title, description});
    newEvento.user = req.user.id;
    await newEvento.save();
    req.flash('success_msg', 'Evento agregado con éxito');
    res.redirect('/eventos');
  }
});

// Get All Eventos
router.get('/eventos', isAuthenticated, async (req, res) => {
  const eventos = await Evento.find({user: req.user.id}).sort({date: 'desc'});
  res.render('eventos/all-eventos', { eventos });
});

// Edit Eventos
router.get('/eventos/edit/:id', isAuthenticated, async (req, res) => {
  const evento = await Evento.findById(req.params.id);
  if(evento.user != req.user.id) {
    req.flash('error_msg', 'No autorizado');
    return res.redirect('/eventos');
  }
  res.render('eventos/edit-evento', { evento });
});

router.put('/eventos/edit-evento/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Evento.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Evento actualizad con éxito');
  res.redirect('/eventos');
});

// Delete Eventos
router.delete('/eventos/delete/:id', isAuthenticated, async (req, res) => {
  await Evento.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Evento eliminado con éxito');
  res.redirect('/eventos');
});

module.exports = router;
