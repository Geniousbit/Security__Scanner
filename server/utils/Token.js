const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const id = user._id;
    const token = jwt.sign({ id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie("token", token, options).json({
        status: "success",
        user,
        token,
    })
}

module.exports = sendToken;