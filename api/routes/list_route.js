'use strict';

module.exports = function(app){
    var controller = require('../controller/controller');

    // Documentation
    app.route('/api/documentation').get(controller.get_documentation);

    // Route
    app.route('/').get(controller.api_cache);
    app.route('/api/').get(controller.api_cache);
    app.route('/api/manga/detail/:manga_endpoint').get(controller.get_manga_detail_cache);
    app.route('/api/hot_manga_update/').get(controller.get_hot_manga_update_cache);
    app.route('/api/manga/chapter/:chapter_endpoint').get(controller.get_chapter_cache);
    app.route('/api/genre/all').get(controller.get_all_genre_cache);
    app.route('/api/genre/:genre_endpoint/:page_number').get(controller.get_genre_cache);
    app.route('/api/latest_update/:page_number').get(controller.get_latest_update_cache);
    app.route('/api/search/').get(controller.get_search_manga_cache);
    app.route('/api/manga/:page_number').get(controller.get_all_manga_cache);
    app.route('/api/manhwa/:page_number').get(controller.get_all_manhwa_cache);
    app.route('/api/manhua/:page_number').get(controller.get_all_manhua_cache);

    // API Path Not Found Handle
    app.route('*').get(controller.not_found);
}