'use strict';

module.exports = function(app){
    var controller = require('../controller/controller');

    app.route('/').get(controller.api_cache);
    app.route('/api/').get(controller.api_cache);
    app.route('/api/manga/detail/:manga_endpoint').get(controller.get_manga_detail_cache);
    app.route('/api/hot_manga_update/').get(controller.get_hot_manga_update_cache);
    app.route('/api/manga/chapter/:chapter_endpoint').get(controller.get_chapter_cache);
}