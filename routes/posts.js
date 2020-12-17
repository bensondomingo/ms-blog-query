const express = require('express');
const router = express.Router();

const posts = require('../public/javascripts/postCollections');

router.get('/', (req, res) => {
  res.send(posts);
});

module.exports = router;
