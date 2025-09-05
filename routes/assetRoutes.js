const express = require("express");
const router = express.Router();
const { addAsset, getAssets } = require("../controllers/assetController");

router.post("/", addAsset);   
router.get("/", getAssets);   

module.exports = router;