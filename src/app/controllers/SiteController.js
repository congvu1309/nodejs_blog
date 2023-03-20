
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
    index(req, res) {
        res.render('sites/home')
    }
}

module.exports = new SiteController();