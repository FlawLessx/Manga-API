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
            const genre_endpoint = $(element).attr('href').split('/')[4] + '/';

            genreList.push({
                genreName,
                genre_endpoint
            })
        });

        // Get Chapter List
        $('.bxcl').find('li').each((i, item) => {
            const meta = $(item).find('span');
            const chapterName = $(meta).find('a').eq(0).text();
            const chapter_endpoint = $(meta).find('a').eq(0).attr('href').split('/')[3] + '/';
            const chapterDownload = $(meta).find('.dload').attr('href');

            chapterList.push({
                chapterName,
                chapter_endpoint,
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
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
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

        client.setex('/api/genre/all', 3600, JSON.stringify(listAllGenre))
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
        const url = baseUrl + '?page=' + page_number;
        const responses = await axios.get(url);
        let $ = cheerio.load(responses.data);

        const latestUpdateList = [];

        $('.utao').each((i, element) => {
            const item = $(element).find('.uta');
            const listNewChapter = [];

            const title = $(item).find('.imgu').find('a').attr('title');
            const manga_endpoint = $(item).find('.imgu').find('a')
                .attr('href').split('/')[4] + '/';
            const image = $(item).find('.imgu').find('img').attr('src').split('?')[0];
            const hotTag = $(item).find('.imgu').find('.hot').text();
            const newTag = $(item).find('.new').find('.new').text();

            $(item).find('ul').find('li').each((i, element) => {
                const chapter_endpoint = $(element).find('a').attr('href')
                    .split('/')[3] + '/';
                const chapterName = $(element).find('a').text();
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
                newTag,
                listNewChapter
            });
        })

        client.setex('/api/latest_update/' + page_number, 300, JSON.stringify(latestUpdateList));
        res.status(200).json(latestUpdateList);

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
        const obj = [];
        var url = page_number == '1' ? baseUrl + 'genres/' + genre_endpoint : baseUrl + 'genres/' + genre_endpoint + 'page/' + page_number;
        const response = await axios.get(url);
        let $ = cheerio.load(response.data);
        obj.test = baseUrl + 'genres/' + genre_endpoint + 'page/' + page_number;

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
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

        client.setex(genre_endpoint + page_number, 3600, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
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
            const chapter = $(element).find(".epxs").text();
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

        client.setex(query, 3600, JSON.stringify(obj));
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
        const obj = [];
        const response = await axios.get(baseUrl + 'manga/?page=' + page_number);
        let $ = cheerio.load(response.data);

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
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

        client.setex('manga/' + page_number, 3600, JSON.stringify(obj));
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
        const obj = [];
        const response = await axios.get(baseUrl + 'manhwa/?page=' + page_number);
        let $ = cheerio.load(response.data);

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
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

        client.setex('manhwa/' + page_number, 3600, JSON.stringify(obj));
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
        const obj = [];
        const response = await axios.get(baseUrl + 'manhua/?page=' + page_number);
        let $ = cheerio.load(response.data);

        $('.bs').find(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const manga_endpoint = $(element).find("a").attr("href").split('/')[4] + '/';
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src").split('?')[0];
            const chapter = $(element).find(".epxs").text();
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

        client.setex('manhua/' + page_number, 3600, JSON.stringify(obj));
        res.status(200).json(obj);

    } catch (e) {
        res.status(404).json({
            error_message: e.message
        });
    }
}