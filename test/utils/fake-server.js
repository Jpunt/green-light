#!/usr/bin/env node

var express = require('express');
var app = express();

app.get('/', function(req, res) {
  res.send('<h1>Hello World!</h1>');
});

app.get('/timeout', function(req, res) {
  res.send(
    '<div>' +
      '<h1></h1>' +
      '<script>' +
        'setTimeout(function() {' +
          'document.querySelector("h1").innerHTML = "Hello World with timeout!";' +
        '}, 200)' +
      '</script>' +
    '</div>'
  );
});

app.listen(4000, function() {
  console.log('Example app listening on port 4000');
});
