
const cheerio = require("cheerio");
const axios = require("axios");
const request = require("request");

request('https://komikindo.co/?s=one%20pie', (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);
        
        const obj = [];

        $('.bs').find(".bsx").each((i, element) => {
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

        console.log(obj);
    }
}
)


/*
request(homeUrl, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(html);


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
