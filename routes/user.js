const express = require("express");
const router = express.Router();
const {signUp,login, Validation, verifyJwt, logout} = require("../controllers/Auth");
const {me} = require("../controllers/User");

// Use Custom MiddleWare To Validate Email and Password are present in request
router.post("/login",Validation,login);
router.post("/signup",Validation,signUp);

// Protected Routes 
router.use(verifyJwt);
router.get("/me",me);
router.post("/logout",logout);


module.exports = router;