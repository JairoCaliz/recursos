const express = require('express');
const router = express.Router();

// Models
const Talento = require('../models/Talento');

// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Talento
router.get('/talentos/add', isAuthenticated, (req, res) => {
  res.render('talentos/new-talento');
});

router.post('/talentos/new-talento', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title) {
    errors.push({text: 'Por favor escriba un título.'});
  }
  if (!description) {
    errors.push({text: 'Por favor escriba una descripción'});
  }
  if (errors.length > 0) {
    res.render('talentos/new-talento', {
      errors,
      title,
      description
    });
  } else {
    const newTalento = new Talento({title, description});
    newTalento.user = req.user.id;
    await newTalento.save();
    req.flash('success_msg', 'talentos agregada con éxito');
    res.redirect('/talentos');
  }
});

// Get All Talentos
router.get('/talentos', isAuthenticated, async (req, res) => {
  const talentos = await Talento.find({user: req.user.id}).sort({date: 'desc'});
  res.render('talentos/all-talentos', { talentos });
});

// Edit Talentos
router.get('/talentos/edit/:id', isAuthenticated, async (req, res) => {
  const talento = await Talento.findById(req.params.id);
  if(talento.user != req.user.id) {
    req.flash('error_msg', 'No autorizado');
    return res.redirect('/talentos');
  }
  res.render('talentos/edit-talento', { talento });
});

router.put('/talentos/edit-talento/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Talento.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Talento actualizado con éxito');
  res.redirect('/talentos');
});

// Delete talentos
router.delete('/talentos/delete/:id', isAuthenticated, async (req, res) => {
  await Talento.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Talento eliminado con éxito');
  res.redirect('/talentos');
});

module.exports = router;
