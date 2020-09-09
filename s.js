const request = require("request");
const cheerio = require("cheerio");
const express = require("express");

let homeUrl = "https://komikindo.co/";
let mangaDetailUrl = 'https://komikindo.co/manga/peerless-soul/';
let chapterUrl = 'http://komikindo.co/peerless-soul-chapter-213/';

request(homeUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);

        //
        // GET Hot Manga Update
        //

        /*
        $(".bsx").each((i, element) => {
            const title = $(element).find("a").attr("title");
            const link = $(element).find("a").attr("href");
            const type = $(element).find("span").text();
            const image = $(element).find("img").attr("src");
            const chapter = $(element).find(".epxs").text();
            const rating = $(element).find("i").text();

            console.log(title.concat("(", type, ")", " : ", link));
            console.log(chapter);
            console.log("Img: " + image + "\n" + "rate: " + rating);
        });
        */

        //
        // GET Manga Detail
        //
        
        /*
        const title = $('infox').find('h1').text();
        const image = $('.thumb').find('img').attr('src').split('?')[0];
        const getMeta = $('.spe').find('span');
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

        const status = $(getMeta).eq(1).text().split(":").pop().trim();
        const author = $(getMeta).eq(2).text().split(":").pop().trim();
        const type =   $(getMeta).eq(3).find('a').text();
        const lastUpdated =   $(getMeta).eq(6).find('time').text();
        const description = $('.desc').find('p').text();

        // Get Chapter List

        $('.bxcl').find('li').each((i, item) => {
            const meta = $(item).find('span');
            const chapterName = $(meta).find('a').eq(0).text();
            const chapterLink = $(meta).find('a').eq(0).attr('href');
            const chapterDownload = $(meta).find('.dload').attr('href');

            chapterList.push({
                chapterName,
                chapterLink,
                chapterDownload
            });
        })
        */

        //
        // GET Manga Image(Reader)
        //

        /*
        const imageList = [];

        $('#readerarea').find('img').each((i, item) => {
            const indexImage = $(item).attr('data-tai');
            const imageLink = $(item).attr('src');

            imageList.push({
                indexImage,
                imageLink
            });
        });
        */

        //
        // GET All Genre
        //

        /*
        const listAllGenre = [];

        $('.genre').find('li').each((i, item) => {
            const meta = $(item).find('a');
            const genreTitle = $(meta).attr('title');
            const genreSubtitle = $(meta).text();
            const genreLink = $(meta).attr('href');

            listAllGenre.push({
                genreTitle,
                genreSubtitle,
                genreLink
            });
        });
        */

        //
        // GET Latest Update
        //

        /*
        const latestUpdateList = [];

        $('.utao').each((i, element) => {
            const item = $(element).find('.uta');
            const listNewChapter = [];

            const title = $(item).find('.imgu').find('a').attr('title');
            const link = $(item).find('.imgu').find('a').attr('href');
            const image = $(item).find('.imgu').find('img').attr('src').split('?')[0];
            const hotTag = $(item).find('.imgu').find('.hot').text();
            const newTag = $(item).find('.new').find('.new').text();

            $(item).find('ul').find('li').each((i, element) => {
                const chapterLink = $(element).find('a').attr('href');
                const chapterName = $(element).find('a').text();
                const updatedOn = $(element).find('span').text();

                listNewChapter.push({
                    chapterName,
                    chapterLink,
                    updatedOn
                });
            });

            latestUpdateList.push({
                title,
                link,
                image,
                hotTag,
                newTag,
                listNewChapter
            });
        });
        */

    } else {
        console.log(error.text());
    }
});
