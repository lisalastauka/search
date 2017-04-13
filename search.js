const Parser = require('./parser');
const rp = require('request-promise-native');

module.exports = class Search {

    getFirstResult() {
        throw new Error('Provide getInfo method');
    }

    searchByQuery(query) {
        const parser = new Parser();

        return this.externalSearch(query)
            .then((data) => {
                return parser.parseData(data)
            })
            .then((data) => {
                return this.getFirstResult(data)
            })
    }

    externalSearch(query) {
        return rp.get({
            uri: this.url + encodeURIComponent(query),
            encoding: null
        }).catch(() => {
            throw new Error(message.terminatedRequest);
        });
    }

};