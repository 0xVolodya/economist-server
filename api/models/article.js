const mongoose = require('mongoose');
const {
  omitBy,
  isNil,
} = require('lodash');


const articleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  subheadline: {
    type: String,
  },
  headline: {
    type: String,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  section: {
    type: String,
  },
  bodyText: {
    type: [String],
  },
}, {
  timestamps: true,
});

articleSchema.statics = {
  list() {
    return this.find()
      .exec();
  },
};
articleSchema.statics = {

  list({
    page = 1,
    perPage = 12,
    section,
  }) {
    const options = omitBy({
      section,
    }, isNil);
    options.perPage = Number(perPage);

    return this.find(options)
      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },
};
module.exports = mongoose.model('Article', articleSchema);
