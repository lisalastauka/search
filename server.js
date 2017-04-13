const express = require('express');
const app = express();
const mustacheExpress = require('mustache-express');
const GoogleSearch = require('./google-search');
const message = {
    overLimit: "Query is too long",
    notFound: 'Nothing found',
    invalidRequest: 'Invalid request',
    terminatedRequest: 'Terminated request'
};

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/html');
app.use(express.static(__dirname + '/public'));

function validateQuery({q = ''}) {
    const trimmedQuery = q.trim();

    if (trimmedQuery && trimmedQuery.length < 128) {
        return Promise.resolve(trimmedQuery);
    }

    return Promise.reject('');
}

app.get('/', function (req, res) {

    validateQuery(req.query)
        .then((query) => {
            const gs = new GoogleSearch();
            return gs.searchByQuery(query)
        })
        .then(function (result) {
            res.render('index', {result});
        })
        .catch(function (message) {
            console.log(message);
            const result = {message};
            res.render('index', {result});
        });
});

app.listen('8081');
console.log('Magic happens on port 8081');
exports = module.exports = app;
