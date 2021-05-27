const Article = require('../models/article');

exports.list = async (req, res, next) => {
  try {
    const articles = await Article.list(req.query);
    res.json(articles);
  } catch (error) {
    next(error);
  }
};

exports.get = async (req, res, next) => {
  try {
    const article = await Article.findOne({ _id: req.params.articleId });
    res.json(article);
  } catch (error) {
    next(error);
  }
};
