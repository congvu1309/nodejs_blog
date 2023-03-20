const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const Category = require('../models/Category');

class CategoryController {

  //[GET] /admin/categories-list
  listCategory(req, res, next) {
    Promise.all([Category.find({}).sort({ createdAt: -1 }), Category.countDocumentsDeleted()])
      .then(([categories, deletedCount]) => {
        res.render('admins/categories/list_cate', {
          deletedCount,
          categories: mutipleMongooseToObject(categories)
        })
      })
      .catch(next);
  }

  //[GET] /admin/categories/add
  addCategory(req, res, next) {
    res.render('admins/categories/add_cate');
  }

  //[POST] /admin/categories/add
  async addCategoryPost(req, res, next) {
    const category_name = req.body.category_name;
    try {
      if (!category_name) {
        return res.render('admins/categories/add_cate', {
          err_warning: 'Bạn Phải Điền Đầy Đủ Thông Tin.',
        });
      }
      const categoryDB = await Category.findOne({
        category_name: category_name,
      });
      if (categoryDB) {
        return res.render('admins/categories/add_cate', {
          categoryname_err: 'Tên đã được sử dụng!',
        });
      }
      Category.create({
        category_name: category_name,
      });
      req.flash('success', 'Thêm thành công.');
      return res.redirect('/admin/categories');
    } catch (err) {
      return res.json(err);
    }
  }

  //[GET] /admin/categories/:id/edit  
  editCategory(req, res, next) {
    Category.findById(req.params.id)
      .then((categories) =>
        res.render('admins/categories/edit_cate', {
          categories: mongooseToObject(categories),
        })
      )
      .catch(next);
  }

  //[POST] /admin/categories/:id/edit
  async editCategoryPost(req, res, next) {
    const category_name = req.body.category_name;

    try {
      if (!category_name) {
        return res.render('admins/categories/edit_cate', {
          err_warning: 'Bạn Phải Điền Đầy Đủ Thông Tin.',
        });
      }
      Category.findByIdAndUpdate(req.params.id,
        {
          category_name: category_name,
        }
      )
        .then(() => {
          req.flash('success', 'Sửa thành công.');
          res.redirect('/admin/categories')
        })
    } catch (err) {
      return res.json(err);
    }
  }

  //[DELETE] /admin/categories/:id
  deleteCategory(req, res, next) {
    Category.delete({ _id: req.params.id })
      .then(() => {
        req.flash('warning', 'Xóa thành công.');
        res.redirect('back')
      })
      .catch(next);
  }

  //[GET] /admin/categories/strash
  strashCategory(req, res, next) {
    Category.findDeleted({}).sort({ createdAt: 1 })
      .then((categories) =>
        res.render('admins/categories/strash_cate', {
          categories: mutipleMongooseToObject(categories)
        })
      )
      .catch(next);
  }

  //[DELETE] /admin/categories/:id/force
  forceDeleteCategory(req, res, next) {
    Category.deleteOne({ _id: req.params.id })
      .then(() => {
        req.flash('danger', 'Xóa thành công.');
        res.redirect('back')
      })
      .catch(next);
  }

  //[PATCH] /admin/categories/:id/restore
  restoreCategory(req, res, next) {
    Category.restore({ _id: req.params.id })
      .then(() => {
        req.flash('success', 'Khôi phục thành công.');
        res.redirect('back')
      })
      .catch(next);
  }

}

module.exports = new CategoryController();
