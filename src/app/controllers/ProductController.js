const {
  mongooseToObject,
  mutipleMongooseToObject,
} = require('../../util/mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

class ProductController {

  //[GET] /admin/products-list
  listProduct(req, res, next) {
    Promise.all([Product.find({}).sort({ createdAt: -1 }).populate({ path: 'category_id' }), Product.countDocumentsDeleted()])
      .then(([products, deletedCount]) => {
        res.render('admins/products/list_pro', {
          deletedCount,
          products: mutipleMongooseToObject(products)
        })
      })
      .catch(next);
  }

  //[GET] /admin/products/add
  async addProduct(req, res, next) {
    let categories = await Category.find({});
    res.render('admins/products/add_pro', {categories: mutipleMongooseToObject(categories)});
  }

  //[POST] /admin/product/add
  async addProductPost(req, res, next) {
    const product_name = req.body.product_name;
    const { product_img } = req.files;
    const category_id = req.body.category_id;
    const product_price = req.body.product_price;
    const product_quantity = req.body.product_quantity;
    const product_describe = req.body.product_describe;
    const product_content = req.body.product_content;
    const product_status = req.body.product_status;

    if (/^product_img/.test(product_img.mimetype)) return res.sendStatus(400);

    try {
      if (
        !product_name ||
        !product_img ||
        !category_id ||
        !product_price ||
        !product_quantity ||
        !product_describe ||
        !product_content ||
        !product_status
      ) {
        return res.render('admins/products/add_pro', {
          err_warning: 'Bạn Phải Điền Đầy Đủ Thông Tin.',
        });
      }

      // Move the uploaded image to our upload folder
      const path = require("path");
      product_img.mv(path.resolve(__dirname, `../../public/upload/${product_img.name}`));

      Product.create({
        product_name: product_name,
        product_img: product_img.name,
        category_id: category_id,
        product_price: product_price,
        product_quantity: product_quantity,
        product_describe: product_describe,
        product_content: product_content,
        product_status: product_status,
      });

      req.flash('success', 'Thêm thành công.');
      return res.redirect('/admin/products');
    } catch (err) {
      return res.json(err);
    }
  }

  //[GET] /admin/products/:id/edit  
   async editProduct(req, res, next) {
    let categories = await Category.find({});
    Product.findById(req.params.id)
      .then((products) =>{
        res.render('admins/products/edit_pro', {
          products: mongooseToObject(products),
          categories: mutipleMongooseToObject(categories),
        })}
      )
      .catch(next);
  }

  //[POST] /admin/products/:id/edit
  async editProductPost(req, res, next) {
    const product_name = req.body.product_name;
    const product_img = req.body.product_img;
    const category_id = req.body.category_id;
    const product_price = req.body.product_price;
    const product_quantity = req.body.product_quantity;
    const product_describe = req.body.product_describe;
    const product_content = req.body.product_content;
    const product_status = req.body.product_status;

    if (
      !product_name ||
      !product_img ||
      !product_price ||
      !product_quantity ||
      !product_describe ||
      !product_content ||
      !product_status
    ) {
      // return res.render('admins/products/edit_pro', {
      //   err_warning: 'Bạn Phải Điền Đầy Đủ Thông Tin.',
      // });
    }

    Product.findByIdAndUpdate(req.params.id,
      {
        product_name: product_name,
        product_img: product_img,
        category_id: category_id,
        product_price: product_price,
        product_quantity: product_quantity,
        product_describe: product_describe,
        product_content: product_content,
        product_status: product_status,
      }
    )
      .then(() => {
        req.flash('success', 'Sửa thành công.');
        res.redirect('/admin/products')
      })
  } catch(err) {
    return res.json(err);
  }

  //[DELETE] /admin/products/:id
  deleteProduct(req, res, next) {
    Product.delete({ _id: req.params.id })
      .then(() => {
        req.flash('warning', 'Xóa thành công.');
        res.redirect('back')
      })
      .catch(next);
  }

  //[GET] /admin/products/strash
  strashProduct(req, res, next) {
    Product.findDeleted({}).sort({ createdAt: 1 })
      .then((products) =>
        res.render('admins/products/strash_pro', {
          products: mutipleMongooseToObject(products)
        })
      )
      .catch(next);
  }

  //[DELETE] /admin/categories/:id/force
  forceDeleteProduct(req, res, next) {
    Product.deleteOne({ _id: req.params.id })
      .then(() => {
        req.flash('danger', 'Xóa thành công.');
        res.redirect('back')
      })
      .catch(next);
  }

  //[PATCH] /admin/categories/:id/restore
  restoreProduct(req, res, next) {
    Product.restore({ _id: req.params.id })
      .then(() => {
        req.flash('success', 'Khôi phục thành công.');
        res.redirect('back')
      })
      .catch(next);
  }
}

module.exports = new ProductController();
