const express = require('express');
const controller = require('../controllers/user');
const { authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(authorize(), controller.list);

router
  .route('/profile')
  .get(authorize(), controller.loggedIn);

module.exports = router;
