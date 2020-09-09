const express = require('express');
const app = express();
const url = require('./constant/base_url');
const { getHotMangaUpdate } = require('./util/scrape');

app.get('/manga/:endPoint', (req, res) => {
    const mangaName = req.params.url;
    const result = getHotMangaUpdate(url + 'manga/' + mangaName)

    res.json(result);
})

app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

//function paginatedResults

app.listen(3000)