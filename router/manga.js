const express = require('express');
const router = express.Router();
const cheerio = require('cheerio');
const baseUrl = require('../constant/base_url');
const request = require("request");

router.get('manga/detail/:mangaEndpoint', async (req, res) => {
    const mangaEndpoint = req.params.mangaEndpoint;
    const obj = {}

    request(baseUrl + 'manga/' + mangaEndpoint, (err, res, html) => {
        if (!err && res.statusCode == 200) {
            let $ = cheerio.load(html);

            //
            // GET Manga Detail
            //

            const getMeta = $('.spe').find('span');

            obj.title  = $('infox').find('h1').text();
            obj.image = $('.thumb').find('img').attr('src').split('?')[0];
            obj.status = $(getMeta).eq(1).text().split(":").pop().trim();
            obj.author = $(getMeta).eq(2).text().split(":").pop().trim();
            obj.type = $(getMeta).eq(3).find('a').text();
            obj.lastUpdated = $(getMeta).eq(6).find('time').text();
            obj.description = $('.desc').find('p').text();
            const genreList = [];
            const chapterList = [];

            // Get Genre

            const genre = $(getMeta).eq(0).find('a').each((i, element) => {
                const genreName = $(element).text();
                const genreLink = $(element).attr('href');

                genreList.push({
                    genreName,
                    genreLink
                })
            });

            // Get Chapter List
            $('.bxcl').find('li').each((i, item) => {
                const meta = $(item).find('span');
                const chapterName = $(meta).find('a').eq(0).text();
                const chapterLink = $(meta).find('a').eq(0).attr('href').split('/')[2];
                const chapterDownload = $(meta).find('.dload').attr('href');

                chapterList.push({
                    chapterName,
                    chapterLink,
                    chapterDownload
                });
            })

            obj.genreList = genreList;
            obj.chapterList = chapterList;
        };
    });

    res.status(200).json(obj);
});

router.get('manga/', async (req, res) => {  

    res.status(200).json({
        success: true,
        message: "MANTUL"
    });
});

module.exports = router;