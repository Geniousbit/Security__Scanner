const express = require('express');
const { createPayment, success } = require('../Controllers/payment');
const router = express.Router();
// const {registerUser, loginUser, logoutUser, verify} = require('../Controllers/auth');

router.route("/payment").post(createPayment);
router.route("/success").post(success)
module.exports = router;