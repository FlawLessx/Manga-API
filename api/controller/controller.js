'use strict';
const request = require("request");
const baseUrl = require('../../constant/base_url');
const cheerio = require("cheerio");
const axios = require("axios");

exports.api = function (req, res) {
    res.status(200).json({
        status: 200,
        message: "Manga-API by Yanuar Bimantoro"
    });
}

exports.get_manga_detail = async function (req, res) {
    try {
        const endpoint = req.params.endpoint;
        const obj = {};
        const response = await axios.get(baseUrl + 'manga/' + endpoint);
        let $ = cheerio.load(response.data);

        //
        // GET Manga Detail
        //

        const getMeta = $('.spe').find('span');

        obj.title = $('.infox').find('h1').text();
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
            const genreEndpoint = $(element).attr('href').split('/')[4] + '/';

            genreList.push({
                genreName,
                genreEndpoint
            })
        });

        // Get Chapter List
        $('.bxcl').find('li').each((i, item) => {
            const meta = $(item).find('span');
            const chapterName = $(meta).find('a').eq(0).text();
            const chapterEndpoint = $(meta).find('a').eq(0).attr('href').split('/')[3] + '/';
            const chapterDownload = $(meta).find('.dload').attr('href');

            chapterList.push({
                chapterName,
                chapterEndpoint,
                chapterDownload
            });
        })

        obj.genreList = genreList;
        obj.chapterList = chapterList;

        res.status(200).json(obj);

    } catch (e) {
        response.status(404).json({
            message: e.message
        });
    }
}