const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8000;
let code = require('./pair');
let mawrldCode = require('./mawrldPair');
let minibotCode = require('./minibotPair');
require('events').EventEmitter.defaultMaxListeners = 500;

app.use('/code', code);
app.use('/mawrld-code', mawrldCode);
app.use('/minibot-code', minibotCode);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'main.html'));
});

app.get('/pair', (req, res) => {
  res.sendFile(path.join(__dirname, 'pair.html'));
});

app.get('/mawrld', (req, res) => {
  res.sendFile(path.join(__dirname, 'mawrld.html'));
});
app.get('/minibot', (req, res) => {
  res.sendFile(path.join(__dirname, 'minibot.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`
Deployment Successful!

nebula-assassin-Server Running on http://localhost:` + PORT)
});

module.exports = app;