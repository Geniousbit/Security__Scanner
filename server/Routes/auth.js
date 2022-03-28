const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  verify,
  currentUser,
} = require("../Controllers/auth");
// const AppError = require('../utils/AppError');
// const errorHandler = require('../utils/errorController');
// const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductDetails, productReview } = require('../controllers/productController');
// const { loginUser, registerUser, logoutUser, authorizeRoles, forgotPassword, resetPassword, getUserDetails, updateProfile, getAllUsers } = require('../controllers/userController');
// const { isAuthenticatedUser } = require('../utils/auth');
// const { newOrder, getSingleOrder, getMyOrders, getAllOrders, updateOrder } = require('../controllers/orderController');
module.exports = router;

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/getUser").get(currentUser);

router.route("/verify/:token").get(verify);

router.route("/logout").get(logoutUser);
