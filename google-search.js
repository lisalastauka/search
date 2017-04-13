const Search = require('./search');
class GoogleSearch extends Search {

    constructor() {
        super();
        this.url = 'https://google.com/search?q=';
    }

    getFirstResult($) {
        const targetSelector = 'cite';
        const target = $(targetSelector);

        if (!target.html()) {
            throw new Error(message.notFound);
        }

        return parseResult(target);
    }

    parseResult(target) {
        target.first().filter(function(){
            const container = $(this).parent().parent().parent().find('a').first();
            const href = container.attr('href');
            return {
                link : href.slice(href.indexOf('=') + 1, href.indexOf('&')),
                title : container.text()
            };
        });
    }
}