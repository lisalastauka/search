const fromEnc = 'cp1251';
const toEnc = 'utf-8';
const Iconv = require('iconv').Iconv;
const translator = new Iconv(fromEnc, toEnc);
const cheerio = require('cheerio');


module.exports = class Parser {

    parseData(data) {
        const html = translator.convert(data).toString();
        const $ = cheerio.load(html);
        return $;
    }
};


