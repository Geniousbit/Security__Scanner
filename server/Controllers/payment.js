const Razorpay = require("razorpay");
const shortid = require("shortid");
const User = require("../Models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });

exports.createPayment = async (req, res) => {
  const { amount } = req.body;
  // console.log(typeof(amount));

  const receipt = shortid.generate();
  // console.log(reciept);
  // let donationDate = `${moment().format("llll")}`;

  var options = {
    amount,
    currency: "INR",
    receipt: receipt,
  };
  instance.orders.create(options, function (err, order) {
    // order.reciept = reciept
    if (err) {
      return res.status(500).json({
        success: "false",
        error: err,
      });
    }
    return res.status(200).json({
      success: "true",
      order: order,
      // reciept,
      message: "Payment made successful",
    });
  });
};

exports.success = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token)
      return res.status(401).json({
        message: "You are not signed in",
      });
    // console.log(process.env.JWT_SECRET);
    const finalToken = token.split(" ")[1];
    // console.log(finalToken);
    const verified = jwt.verify(finalToken, process.env.JWT_SECRET);
    console.log(verified.id);

    // setting up dates
    var date = new Date();

    var startDate = new Date();
    startDate.setDate(date.getDate());
    startDate = startDate.getTime().toString();

    var remainderDate = new Date();
    remainderDate.setDate(date.getDate() + 29);
    remainderDate = remainderDate.getTime().toString();

    var endDate = new Date();
    endDate.setDate(date.getDate() + 30);
    endDate = endDate.getTime().toString();

    const user_ = await User.findByIdAndUpdate(verified.id, { isPaid: true, startDate, remainderDate, endDate });

    res.status(200).json({
      message: "Congratulations the payment has been made successful",
      user_,
    });
  } catch (err) {
    console.log(err);
    // res.status(500).json({
    //     message: "Some error occured"
    // })
  }
};
