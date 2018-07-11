const app = require('./app');

const listener = app.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on port ${listener.address().port}`)
);
