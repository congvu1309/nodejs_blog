const express = require("express");
const router = express.Router();
const AdminRouter = require("../app/controllers/AdminController");
const CategoryRouter = require("../app/controllers/CategoryController");
const ProductRouter = require("../app/controllers/ProductController");

//Admin Router
router.get("/login", AdminRouter.loginAdmin);
router.post("/login", AdminRouter.loginPost);
router.get("/logout", AdminRouter.loginAdmin);
router.get("/", AdminRouter.index);

//Category Router
router.get("/categories/add", CategoryRouter.addCategory);
router.post("/categories/add", CategoryRouter.addCategoryPost);
router.get("/categories/:id/edit", CategoryRouter.editCategory);
router.post("/categories/:id/edit", CategoryRouter.editCategoryPost);
router.delete("/categories/:id", CategoryRouter.deleteCategory);
router.get("/categories/strash", CategoryRouter.strashCategory);
router.delete("/categories/:id/force", CategoryRouter.forceDeleteCategory);
router.patch("/categories/:id/restore", CategoryRouter.restoreCategory);
router.get("/categories", CategoryRouter.listCategory);

//Product Router
router.get("/products/add", ProductRouter.addProduct);
router.post("/products/add", ProductRouter.addProductPost);
router.get("/products/:id/edit", ProductRouter.editProduct);
router.post("/products/:id/edit", ProductRouter.editProductPost);
router.delete("/products/:id", ProductRouter.deleteProduct);
router.get("/products/strash", ProductRouter.strashProduct);
router.delete("/products/:id/force", ProductRouter.forceDeleteProduct);
router.patch("/products/:id/restore", ProductRouter.restoreProduct);
router.get("/products", ProductRouter.listProduct);

module.exports = router;
