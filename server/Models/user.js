const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../Models/Token");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Email is Badly formatted"],
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "The passwords doesn't match",
    },
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  isEmailSent: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: String,
    default: "",
  },
  remainderDate: {
    type: String,
    default: "",
  },
  endDate: {
    type: String,
    default: "",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.confirmPassword = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new Token(payload);
};

module.exports = mongoose.model("user", userSchema);
