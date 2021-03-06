'use strict';

const { json } = require('express');
const services = require("../services/services");// Require 'bluebird' in your package.json file, and run npm install.
const fs = require('fs');
const marked = require('marked');
const myCache = require("../../constant/cache")

exports.not_found = (req, res) => {
    res.status(404).json({
        message: "API path not found, please read documentation again"
    })
}

exports.get_documentation = (req, res) => {
    var path = 'README.md';
    var file = fs.readFileSync(path, 'utf8');
    res.send(marked(file.toString()));
}

exports.api_cache = (req, res) => {
    let result = myCache.get('/api/')

    console.log(result)
    if (result != undefined) {
        //const parseResult = JSON.parse(result);
        res.send(result);
    }
    else
        services.api(req, res);
}

exports.get_manga_detail_cache = (req, res) => {
    const manga_endpoint = req.params.manga_endpoint;
    //manga_endpoint
    const result = myCache.get(manga_endpoint)
    console.log(result)

    if (result != undefined) {
        //const parseResult = JSON.parse(result);
        res.send(result);
    }
    else
        services.get_manga_detail(req, res);

}

exports.get_hot_manga_update_cache = (req, res) => {
    result = myCache.get('/api/hot_manga_update/')
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_hot_manga_update(req, res);
}

exports.get_chapter_cache = (req, res) => {
    const chapter_endpoint = req.params.chapter_endpoint;

    result = myCache.get(chapter_endpoint)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_chapter(req, res);
}

exports.get_all_genre_cache = (req, res) => {

    result = myCache.get('/api/genre/all')
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_all_genre(req, res);
}

exports.get_genre_cache = (req, res) => {
    const genre_endpoint = req.params.genre_endpoint;
    const page_number = req.params.page_number;

    result = myCache.get(genre_endpoint + page_number)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_genre(req, res);
}

exports.get_latest_update_cache = (req, res) => {
    const page_number = req.params.page_number;

    result = myCache.get('/api/latest_update/' + page_number)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_latest_update(req, res)
}

exports.get_search_manga_cache = (req, res) => {
    const query = req.query.query;

    result = myCache.get('search: ' + query)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_search_manga(req, res);
}

exports.get_all_manga_cache = (req, res) => {
    const page_number = req.params.page_number;

    result = myCache.get('manga/' + page_number)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_all_manga(req, res);
}

exports.get_all_manhwa_cache = (req, res) => {
    const page_number = req.params.page_number;

    result = myCache.get('manhwa/' + page_number)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_all_manhwa(req, res);
}

exports.get_all_manhua_cache = (req, res) => {
    const page_number = req.params.page_number;

    result = myCache.get('manhua/' + page_number)
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_all_manhua(req, res);
}

exports.get_best_series_cache = (req, res) => {
    result = myCache.get('best-series')
    if (result != undefined) {
        const parseResult = JSON.parse(result);
        res.send(parseResult);
    }
    else
        services.get_best_series(req, res);
}