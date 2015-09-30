var express = require('express');

process.env.PORT = process.env.PORT || 3000;

var app = module.exports.app = exports.app = express();

app.use(express.static('app'));

app.use(function(err, req, res, next) {
    if(err.code === 'ECONNREFUSED') {
        res.status(502).send('Bad Gateway: connection refused by server at ' + apiAddress);
        res.end();
    }
});

app.listen(process.env.PORT);

console.log('Listening on port ' + process.env.PORT + '.');
console.log('Ctrl+C to shut down.');