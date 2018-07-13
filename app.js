require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const Url = require('./models/Url');

const app = express();

mongoose.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true },
  (err, _) => {
    if (!err) {
      console.log('Successfully connected to MLab');
    }
  }
);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (_, res) => {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  const { shortUrl } = req.params;
  Url.findOne({ shortUrl: shortUrl }, (err, doc) => {
    if (err) {
      return err;
    }
    const { originalUrl } = doc;
    res.redirect(originalUrl);
  });
});

app.post('/api/shorturl/new', (req, res) => {
  const originalUrl = req.body.url;

  if (!checkUrl(originalUrl)) {
    res.json({
      error: 'invalid URL',
    });
  }

  Url.findOne({ originalUrl: originalUrl }, (err, doc) => {
    if (doc) {
      const { shortUrl } = doc;
      res.json({
        originalUrl,
        shortUrl,
      });
    } else {
      const url = new Url({
        originalUrl: originalUrl,
        shortUrl: Math.floor(Math.random() * 100000),
      });

      url.save().then(result => {
        res.json({
          originalUrl: result.originalUrl,
          shortUrl: result.shortUrl,
        });
      });
    }
  });
});

function checkUrl(url) {
  const urlRegex = /^http[s]?:\/\/www\.[a-z]{3,}.com/;
  return urlRegex.test(url);
}

module.exports = app;
