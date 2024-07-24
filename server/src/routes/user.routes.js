const { Router } = require("express");
const { loginAdmin, registerUser, myProfile } = require("../controllers/user.controller.js");

const router = Router();

// !! public routes --------------------------------
router.route("/login").post(loginAdmin);
router.route("/register").post(registerUser);

// !! secured routes --------------------------------

module.exports = router;
