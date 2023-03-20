const express = require("express");
const router = express.Router();
const SiteRouter = require("../app/controllers/SiteController");

router.get("/", SiteRouter.index);

module.exports = router;
