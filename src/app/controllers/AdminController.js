const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const User = require('../models/User');

class AdminController {
  index(req, res) {
    res.render('admins/sites/login_admin', { layout: 'admin_no_partials' });
  }

  //[GET] /admin/login (view admin Login Form)
  loginAdmin(req, res) {
    res.render('admins/sites/login_admin', { layout: 'admin_no_partials' });
  }

  //[POST] /admin/login
  async loginPost(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    try {
      const useradminDB = await User.findOne({ username: username });
      const stringRole = ['Quản Lý'];
      if (
        !useradminDB ||
        useradminDB.password != password ||
        !stringRole.includes(useradminDB.role_name)
      ) {
        return res.render('admins/sites/login_admin', {
          layout: 'admin_no_partials',
          message: 'Tài Khoản Hoặc Mật Khẩu Không Chính Xác',
        });
      }

      req.session.UserAdmin = {
        _id: useradminDB.id,
        useradmin: useradminDB.username,
      };

      return res.render('admins/sites/home_admin');
    } catch (err) {
      return res.json(err);
    }
  }

  //[GET] /admin/logout
  logoutAdmin(req, res, next) {
    if (req.session) {
      req.session.destroy(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect('/admin');
      });
    }
  }
}

module.exports = new AdminController();
