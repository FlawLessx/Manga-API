'use strict';

module.exports = function(app){
    var controller = require('../controller/controller');

    app.route('/').get(controller.api);
    app.route('/api/').get(controller.api);

    app.route('/api/manga/detail/:endpoint').get(controller.get_manga_detail);
}