const NodeCache = require("node-cache");
module.exports = new NodeCache({checkperiod: 120 });