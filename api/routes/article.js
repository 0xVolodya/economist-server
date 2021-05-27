const express = require('express');
const controller = require('../controllers/article');
const { authorize } = require('../middlewares/auth');

const router = express.Router();


router
  .route('/')
  .get(authorize(), controller.list);

router
  .route('/:articleId')
  .get(authorize(), controller.get);

module.exports = router;
