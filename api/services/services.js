'use strict';

const baseUrl = require('../../constant/base_url');
const cheerio = require("cheerio");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();

exports.api = (req, res) => {
    try {
        const obj = {
            status: 200,
            message: "Manga-API by Yanuar Bimantoro",
            documentation: "Check documentation on /api/documentation"
        }

        client.setex('/api/', 3600, JSON.stringify(obj));
        res.status(200).json(obj);
    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_manga_detail = async (req, res) => {
    try {
        const manga_endpoint = req.params.manga_endpoint;
        const obj = {};
        const response = await axios.get(baseUrl + 'manga/' + manga_endpoint);
        let $ = cheerio.load(response.data);

        //
        // GET Manga Detail
        //

        const getMeta = $('.spe').find('span');

        obj.title = $('.infox').find('h1').text();
        obj.image = $('.thumb').find('img').attr('src').split('?')[0];
        obj.status = $(getMeta).eq(1).text().split(":").pop().trim();
        obj.released = $(getMeta).eq(2).text().split(":").pop().trim();
        obj.author = $(getMeta).eq(3).text().split(":").pop().trim();
        obj.type = $(getMeta).eq(4).find('a').text();
        obj.rating = $('.rating').find('strong').text().split(' ')[1];
        obj.lastUpdated = $(getMeta).eq(7).find('time').text();
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

        client.setex(manga_endpoint, 300, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_hot_manga_update = async (req, res) => {
    try {
        const obj = [];
        const response = await axios.get(baseUrl);
        let $ = cheerio.load(response.data);

        $(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const mangaEndpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
            const rating = $(element).find("i").text();

            obj.push({
                title,
                mangaEndpoint,
                type,
                image,
                chapter,
                rating
            })
        });

        client.setex('/api/hot_manga_update/', 300, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_chapter = async (req, res) => {
    try {
        const chapter_endpoint = req.params.chapter_endpoint;
        const responses = await axios.get(baseUrl + chapter_endpoint);
        let $ = cheerio.load(responses.data);
        const imageList = [];

        $('#readerarea').find('img').each((i, item) => {
            const indexImage = $(item).attr('data-tai');
            const imageLink = $(item).attr('src');

            imageList.push({
                indexImage,
                imageLink
            });
        });

        client.setex(chapter_endpoint, 3600, JSON.stringify(imageList));
        res.status(200).json(imageList);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}