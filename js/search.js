const Parser = require('./parser');
const rp = require('request-promise-native');
module.exports = class Search {

    getResult() {
        throw new Error('Provide getFirstResult method');
    }

    searchByQuery(query) {
        const parser = new Parser();

        return this.externalRequest(query)
            .then((data) => {
                return parser.parseData(data)
            })
            .then((data) => {
                return this.getResult(data)
            })
    }

    getUrl () {
        if(!this.url) {
            throw new Error('Provide url property');
        }

        return this.url;
    }

    externalRequest(query) {
        return rp.get({
            uri: this.getUrl() + query,
            encoding: null
        }).catch(() => {
            throw new Error('Terminated request');
        });
    }
};