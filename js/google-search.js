const Search = require('./search');

module.exports = class GoogleSearch extends Search {

    constructor() {
        super();
        this.url = 'https://google.com/search?q=';
    }

    getResult($) {
        const targetSelector = 'cite';
        const target = $(targetSelector);

        if (!target.html()) {
            throw new Error('Nothing found');
        }

        return this.parseResult(target, $);
    }

    parseResult(target, $) {
        const data = {};

        target.first().filter(function(){
            const container = $(this).parent().parent().parent().find('a').first();
            const href = container.attr('href');
            data.link = href.slice(href.indexOf('=') + 1, href.indexOf('&'));
            data.title = container.text();

        });
        return data;
    }
};