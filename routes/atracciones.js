const express = require('express');
const router = express.Router();

// Models
const Atraccione = require('../models/Atraccione');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Atracciones
router.get('/atracciones/add', isAuthenticated, (req, res) => {
  res.render('atracciones/new-atraccione');
});

router.post('/atracciones/new-atraccione', isAuthenticated, async (req, res) => {
  const { title, description, place} = req.body;
  const errors = [];

  if (!title) {
    errors.push({text: 'Por favor escriba un título.'});
  }
  if (!description) {
    errors.push({text: 'Por favor escriba una descripción'});
  }
  if (!place) {
    errors.push({text: 'Por favor escriba un lugar'});
  }
  if (errors.length > 0) {
    res.render('atracciones/new-atraccione', {
      errors,
      title,
      description
    });
  } else {

    const newAtraccione = new Atraccione();
    newAtraccione.user = req.user.id;
    newAtraccione.user.name = req.user.name;
    newAtraccione.title = req.body.title;
    newAtraccione.description = req.body.description;
    newAtraccione.place = req.body.place;
    newAtraccione.filename = req.file.filename;
    newAtraccione.path = '/img/uploads/' + req.file.filename;
    newAtraccione.originalname = req.file.originalname;
    newAtraccione.mimetype = req.file.mimetype;
    newAtraccione.size = req.file.size;
  
    await newAtraccione.save();

    req.flash('success_msg', 'Atracciones agregada con éxito');
    res.redirect('/atracciones');
  }
});

// Get All Atracciones
router.get('/atracciones', isAuthenticated, async (req, res) => {
  const atracciones = await Atraccione.find({user: req.user.id}).sort({date: 'desc'});
  res.render('atracciones/all-atracciones', { atracciones });
});


// Edit atracciones
router.get('/atracciones/edit/:id', isAuthenticated, async (req, res) => {
  const atraccione = await Atraccione.findById(req.params.id);
  if(atraccione.user != req.user.id) {
    req.flash('error_msg', 'No autorizado');
    return res.redirect('/atracciones');
  }
  res.render('atracciones/edit-atraccione', { atraccione });
});

router.put('/atracciones/edit-atraccione/:id', isAuthenticated, async (req, res) => {
  const { title, description} = req.body;
  await Atraccione.findByIdAndUpdate(req.params.id, {title, description, place, filename});
  req.flash('success_msg', 'Atracciones actualizadas con éxito');
  res.redirect('/atracciones');
});

// Delete atracciones
router.delete('/atracciones/delete/:id', isAuthenticated, async (req, res) => {
  await Atraccione.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Atracciones eliminada con éxito');
  res.redirect('/atracciones');
});

module.exports = router;
