const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/historia', (req, res) => {
  res.render('historia');
});

module.exports = router;
