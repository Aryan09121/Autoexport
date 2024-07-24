const express = require("express");
const router = express.Router();
const { createProfile, updateProfile, getProfile } = require("../controllers/Settings.controller");

router.post("/create/profile", createProfile);
router.put("/update/profile", updateProfile);
router.get("/get/profile", getProfile);

module.exports = router;
