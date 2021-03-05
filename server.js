const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const http = require('http');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(bodyParser.json());

var routes = require('./api/routes/list_route');
routes(app);

app.listen(port)
console.log('Listen on port: ' + port);

