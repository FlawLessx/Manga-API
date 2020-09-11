
const cheerio = require("cheerio");
const axios = require("axios");
const request = require("request");

request('https://komikindo.co/urban-god-chapter-134/', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        
        const imageList = [];

        $('#readerarea').find('img').each((i, item) => {
            const indexImage = $(item).attr('data-tai');
            const imageLink = $(item).attr('src');

            imageList.push({
                indexImage,
                imageLink
            });
        });

        console.log(imageList);
    }
}
)


/*
request(homeUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);

        //
        // GET Manga Image(Reader)
        //




        //
        // GET All Genre
        //


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


        //
        // GET Latest Update
        //

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

} else {
console.log(error.text());
}
}); */
