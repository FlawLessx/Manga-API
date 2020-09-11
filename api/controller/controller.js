'use strict';

const redis = require("redis");
const { json } = require('express');
const client = redis.createClient();
const services = require("../services/services");
const baseUrl = require("../../constant/base_url");

exports.api_cache = (req, res) => {
    client.get('/api/', (err, result) => {
        if (result) {
            const parseResult = JSON.parse(result);
            res.send(parseResult);
        }
        else
            services.api(req, res);
    });
}

exports.get_manga_detail_cache = (req, res) => {
    const manga_endpoint = req.params.manga_endpoint;

    client.get(manga_endpoint, (err, result) => {
        if (result) {
            const parseResult = JSON.parse(result);
            res.send(parseResult);
        }
        else
            services.get_manga_detail(req, res);
    })
}

exports.get_hot_manga_update_cache = (req, res) => {
    client.get('/api/hot_manga_update/', (err, result) => {
        if (result) {
            const parseResult = JSON.parse(result);
            res.send(parseResult);
        }
        else
            services.get_hot_manga_update(req, res);
    })
}

exports.get_chapter_cache = (req, res) => {
    const chapter_endpoint = req.params.chapter_endpoint;
    
    client.get(chapter_endpoint, (err, result) => {
        if (result) {
            const parseResult = JSON.parse(result);
            res.send(parseResult);
        }
        else
            services.get_chapter(req, res);
    })
}