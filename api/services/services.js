'use strict';

const baseUrl = require('../../constant/base_url');
const cheerio = require("cheerio");
const axios = require("axios");
const redis = require("redis");
const client = redis.createClient();
const jsonFile = require('jsonfile');

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
        const response = await axios.get(baseUrl + 'komik/' + manga_endpoint);
        let $ = cheerio.load(response.data);

        //
        // GET Manga Detail
        //

        const getMeta = $('.spe').find('span');

        obj.title = $('.infox').find('h1').text().split('Bahasa')[0].trim();
        obj.mangaEndpoint = manga_endpoint + '/';
        obj.image = $('.thumb').find('img').attr('src').split('?')[0];
        obj.status = $(getMeta).eq(1).text().split(":").pop().trim();
        obj.released = $(getMeta).eq(2).text().split(":").pop().trim();
        obj.author = $(getMeta).eq(3).text().split(":").pop().trim();
        obj.type = $(getMeta).eq(4).find('a').text();
        obj.rating = $('.rating').find('strong').text().split(' ')[1];
        obj.lastUpdated = $(getMeta).eq(6).find('time').text();
        obj.description = $('.desc').find('p').text();
        const genreList = [];
        const chapterList = [];

        // Get Genre
        const genre = $(getMeta).eq(0).find('a').each((i, element) => {
            const genreName = $(element).text();
            const genre_endpoint = $(element).attr('href').split('/')[4] + '/';

            genreList.push({
                genreName,
                genre_endpoint
            })
        });

        // Get Chapter List
        $('.cl').find('li').each((i, item) => {
            const meta = $(item).find('span');
            const chapterName = $(meta).find('a').eq(0).text();
            const chapter_endpoint = $(meta).find('a').eq(0).attr('href').split('/')[4] + '/';
            const updatedOn = $(meta).eq(1).text();

            chapterList.push({
                chapterName,
                chapter_endpoint,
                updatedOn
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
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            obj.push({
                title,
                manga_endpoint,
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
            if (i === 0){
                return;
            }

            const imageLink = $(item).attr('src');

            imageList.push({
                imageLink
            });
        });

        client.setex(chapter_endpoint, 6000, JSON.stringify(imageList));
        res.status(200).json(imageList);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_all_genre = async (req, res) => {
    try {
        const responses = await axios.get(baseUrl);
        let $ = cheerio.load(responses.data);

        const listAllGenre = [];

        $('.genre').find('li').each((i, item) => {
            const meta = $(item).find('a');
            const genreTitle = $(meta).attr('title');
            const genreSubtitle = $(meta).text();
            const genre_endpoint = $(meta).attr('href').split('/')[4] + '/';

            listAllGenre.push({
                genreTitle,
                genreSubtitle,
                genre_endpoint
            });
        });

        client.setex('/api/genre/all', 6000, JSON.stringify(listAllGenre))
        res.status(200).json(listAllGenre);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_latest_update = async (req, res) => {
    try {
        const page_number = req.params.page_number;
        const url = baseUrl + 'page/' + page_number;
        const responses = await axios.get(url);
        let $ = cheerio.load(responses.data);
        const obj = {};
        const latestUpdateList = [];

        // Find previous & next page
        const convertedPageNumber = parseInt(page_number);

        const pageMeta = $('.hpage');
        obj.previousPage = convertedPageNumber != 1 ? (convertedPageNumber - 1) : 0
        obj.currentPage = convertedPageNumber;
        obj.nextPage = $(pageMeta).find('.dashicons-arrow-right-alt2') != "" ? (convertedPageNumber + 1) : 0

        const listData = [];
        $('.listupd').each((i, el) => {
            listData.push({ el });
        });

        const data = listData[2].el;

        // Find latest update 
        $(data).find('.utao').each((i, element) => {
            const item = $(element).find('.uta');
            const listNewChapter = [];

            const title = $(item).find('.imgu').find('a').attr('title');
            const manga_endpoint = $(item).find('.imgu').find('a')
                .attr('href').split('/')[4] + '/';
            const image = $(item).find('.imgu').find('img').attr('src').split('?')[0];
            const hotTag = $(item).find('.imgu').find('.hot') != "" ? "H" : "";
            const type = $(item).find('ul').attr('class');

            $(item).find('ul').find('li').each((i, element) => {
                const chapter_endpoint = $(element).find('a').attr('href')
                    .split('/')[4] + '/';
                const chapterName ='Ch.' + $(element).find('a').text().split(' ')[1];
                const updatedOn = $(element).find('span').text();

                listNewChapter.push({
                    chapterName,
                    chapter_endpoint,
                    updatedOn
                });
            });

            latestUpdateList.push({
                title,
                manga_endpoint,
                image,
                hotTag,
                type,
                listNewChapter
            });
        })

        obj.latestUpdateList = latestUpdateList;

        client.setex('/api/latest_update/' + page_number, 300, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_genre = async (req, res) => {
    const genre_endpoint = req.params.genre_endpoint;
    const page_number = req.params.page_number;

    try {
        const obj = {};
        const result = [];
        var url = baseUrl + 'genres/' + genre_endpoint + '/' + 'page/' + page_number;
        const response = await axios.get(url);
        let $ = cheerio.load(response.data);

        // Find pagination info
        const convertedPageNumber = parseInt(page_number);
        const pageMeta = $('.pagination');
        obj.previousPage = $(pageMeta).find('.prev') != ""
            ? (convertedPageNumber - 1) : 0;
        obj.currentPage = convertedPageNumber;
        obj.nextPage = $(pageMeta).find('.next') != ""
            ? (convertedPageNumber + 1) : 0;

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a")
                .attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            result.push({
                title,
                manga_endpoint,
                type,
                image,
                chapter,
                rating
            })
        });
        obj.result = result;

        client.setex(genre_endpoint + page_number, 6000, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message,
        });
    }
}

exports.get_search_manga = async (req, res) => {
    const query = req.query.query;

    try {
        const obj = [];
        const response = await axios.get(baseUrl + '?s=' + query);
        let $ = cheerio.load(response.data);

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            obj.push({
                title,
                manga_endpoint,
                type,
                image,
                chapter,
                rating
            })
        });

        client.setex(query, 6000, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_all_manga = async (req, res) => {
    const page_number = req.params.page_number;

    try {
        const obj = {};
        const result = [];
        const response = await axios.get(baseUrl + 'type/manga/page/' + page_number);
        let $ = cheerio.load(response.data);

        // Find previous & next page
        const convertedPageNumber = parseInt(page_number);

        const pageMeta = $('.pagination');
        obj.previousPage = $(pageMeta).find('.prev') != "" ? (convertedPageNumber - 1) : 0
        obj.currentPage = convertedPageNumber;
        obj.nextPage = $(pageMeta).find('.next') != "" ? (convertedPageNumber + 1) : 0

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a")
                .attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            result.push({
                title,
                manga_endpoint,
                type,
                image,
                chapter,
                rating
            })
        });

        obj.result = result;

        client.setex('manga/' + page_number, 6000, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_all_manhwa = async (req, res) => {
    const page_number = req.params.page_number;

    try {
        const obj = {};
        const result = [];
        const response = await axios.get(baseUrl + 'type/manhwa/page/' + page_number);
        let $ = cheerio.load(response.data);

        // Find pagination info
        const convertedPageNumber = parseInt(page_number);
        const pageMeta = $('.pagination');
        obj.previousPage = $(pageMeta).find('.prev') != "" ? (convertedPageNumber - 1) : 0
        obj.currentPage = convertedPageNumber;
        obj.nextPage = $(pageMeta).find('.next') != "" ? (convertedPageNumber + 1) : 0

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a")
                .attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            result.push({
                title,
                manga_endpoint,
                type,
                image,
                chapter,
                rating
            })
        });

        obj.result = result;

        client.setex('manhwa/' + page_number, 6000, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_all_manhua = async (req, res) => {
    const page_number = req.params.page_number;

    try {
        const obj = {};
        const result = [];
        const response = await axios.get(baseUrl + 'type/manhua/page/' + page_number);
        let $ = cheerio.load(response.data);

        // Find pagination info
        const convertedPageNumber = parseInt(page_number);
        const pageMeta = $('.pagination');
        obj.previousPage = $(pageMeta).find('.prev') != "" ? (convertedPageNumber - 1) : 0
        obj.currentPage = convertedPageNumber;
        obj.nextPage = $(pageMeta).find('.next') != "" ? (convertedPageNumber + 1) : 0

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a")
                .attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text().trim().split('/')[0];
            const rating = $(element).find("i").text();

            result.push({
                title,
                manga_endpoint,
                type,
                image,
                chapter,
                rating
            })
        });

        obj.result = result;

        client.setex('manhua/' + page_number, 6000, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}

exports.get_best_series = async (req, res) => {
    try {
        const jsonfile = require('jsonfile');
        const file = 'constant/best_series.json';

        jsonfile.readFile(file, function (err, obj) {
            if (err) {
                res.status(404).json({
                    error_message: err.message
                });
            }
            client.setex('best-series', 6000, JSON.stringify(obj));
            res.status(200).json(obj);
        })

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}
