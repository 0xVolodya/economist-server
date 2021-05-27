const mongoose = require('mongoose');

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
module.exports = mongoose.model('Article', articleSchema);
