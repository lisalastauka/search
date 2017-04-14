const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const GoogleSearch = require('./js/google-search');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use(express.static(__dirname + '/public'));

function validateQuery({query = ''}) {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
        return Promise.reject('');
    }

    if (trimmedQuery.length >= 128) {
        return Promise.reject('Invalid request');
    }

    return Promise.resolve(trimmedQuery);
}

app.get('/', function (req, res) {

    validateQuery(req.query)
        .then((query) => {
            const gs = new GoogleSearch();
            return gs.searchByQuery(query);
        })
        .then(function (result) {
            res.render('index', {result});
        })
        .catch(function (message) {
            const result = {message};
            res.render('index', {result});
        });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
