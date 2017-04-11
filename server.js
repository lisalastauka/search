const express = require('express');
const fs = require('fs');
const request = require('request');
const rp = require('request-promise-native');
const cheerio = require('cheerio');
const Iconv = require('iconv').Iconv;
const fromEnc = 'cp1251';
const toEnc = 'utf-8';
const translator = new Iconv(fromEnc, toEnc);
const app = express();
const url = 'https://google.com/search?q=';
const queryLengthLimit = 200;
const message = {
    overLimit: "Query is too long",
    notFound: 'Nothing found',
    invalidRequest: 'Invalid request',
    error: 'Error'
};
const targetSelector = 'cite';
const htmlLink = (obj) => `<a href=${obj.link}> ${obj.title}</a>`;

const getDataFromTarget = function getDataFromTarget(target, $) {
    const data = {};
    target.first().filter(function () {
        const href = $(this).parent().parent().prev().find('a').attr('href');
        data.link = href.slice(href.indexOf('=') + 1, href.indexOf('&'));
        data.title = $(this).parent().parent().prev().text();

    });
    return data;
};

const parseData = function parseData(data) {
    const html = translator.convert(data).toString();
    const $ = cheerio.load(html);
    const target = $(targetSelector);

    if (target.html()) {
        return getDataFromTarget(target, $);
    }
};

const validateRequest = function (req) {
    let query = req.url.substring(4).replace(/^\++|\++$/g, '');
    if (query.length === 0) {
        return {message: message.invalidRequest};
    } else if (query.length > queryLengthLimit) {
        return {message: message.overLimit};
    }
    else return {query};
};

app.get('/', function (req, res) {
    const query = validateRequest(req).query;
    if (!query) {
        res.sendFile('./index.html', {root: __dirname});
    } else {
        rp.get({
            uri: url + query,
            encoding: null
        })
            .then(function (data) {
                res.send(htmlLink(parseData(data)) || message.notFound);
            });
    }
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
