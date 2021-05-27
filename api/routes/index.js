const express = require('express');

const userRoutes = require('./user');
const authRoutes = require('./auth');
const articleRoutes = require('./article');

const router = express.Router();

router.get('/status', (req, res) => res.send('OK'));

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);

module.exports = router;
