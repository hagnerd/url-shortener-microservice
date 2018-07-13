const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
  originalUrl: String,
  shortUrl: Number,
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
