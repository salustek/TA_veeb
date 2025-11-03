const express = require("express");
const router = express.Router();

//kontrollerid
const {
	eestifilm,
	inimesed,
	inimesedAdd,
	ametid,
	ametidAdd,
	ametidAddPost,
	inimesedAddPost} = require("../controllers/eestifilmControllers");
	

router.route("/").get(eestifilm);

router.route("/filmiinimesed").get(inimesed);

router.route("/filmiinimesed_add").get(inimesedAdd);

router.route("/filmiinimesed_add").post(inimesedAddPost);

router.route("/ametid").get(ametid);

router.route("/ametid_add").get(ametidAdd);

router.route("/ametid_add").post(ametidAddPost);

module.exports = router;





