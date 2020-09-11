const express = require('express');
const app = express();
const port = process.env.port || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var routes = require('./api/routes/list_route');
routes(app);

app.listen(port)
console.log('Listen on port: ' + port);