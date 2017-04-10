var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var Iconv = require('iconv').Iconv;
var fromEnc = 'cp1251';
var toEnc = 'utf-8';
var translator = new Iconv(fromEnc,toEnc);
var app  = express();

var parseData = function parseData(data){
  const html = translator.convert(data).toString();
  const $ = cheerio.load(html);
  const target = $('cite');
  let result;

  if(!target.html()){
    result = 'Nothing found';
  } else {
    target.first().filter(function(){
      const href = $(this).parent().parent().prev().find('a').attr('href');
      const title = $(this).parent().parent().prev().text();
      const link = href.slice(href.indexOf('=')+1,href.indexOf('&'));
      result = `<a href=${link}> ${title}</a>`;
    });
  }
  return result;
};


app.get('/', function(req, res){
  const query = req.url.substring(1);

  if(!query){
    res.sendFile('./index.html', { root: __dirname });
  } else
  if (query.length > 200) {
    res.send("Query is too long");
  } else {
    const url = 'https://google.com/search'+query;
    request( {
      url : url,
      encoding : null }, function (error, response, data) {
        if(!error){
          res.send(parseData(data));
        }
    })
  }

});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
