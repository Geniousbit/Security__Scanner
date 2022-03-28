const User = require("../Models/user");
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/Token")
const Token = require("../Models/Token");
const jwt = require('jsonwebtoken');

exports.registerUser = async(req, res) => {
    try{
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.confirmPassword
        })
        // console.log(user);
    
        const user_ = await user.save();
        
        await sendVerificationEmail(user_, req, res);
        
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: "false",
            message: "some error occured",
        })
    }
}

exports.verify = async (req, res) => {
    if(!req.params.token) 
        return res.status(400).json({message: "aisa koi nai hai"});
    try {
        const token = await Token.findOne({ token: req.params.token });
        if (!token) 
            return res.status(400).json({ message: 'link expire ho gaya' });
        const user = await User.findOne({ _id: token.userId });
        // console.log(user);
        if (!user) 
            return res.status(400).json({ message: 'aisa koi nai hai' });
        if (user.isVerified) 
            return res.status(400).json({ message: 'verified hai already' });
        await User.findByIdAndUpdate(user._id, {isVerified: true});

        res.status(200).send("Verify ho gaya login karlo.");

        // await User.findOne({ _id: token.userId }, async (err, user) => {
            // user.isVerified=true;
            // user.save(function (err) {
            //     if (err) 
            //         return res.status(500).json({message:err.message});
                // res.status(200).send("Verify ho gaya login karlo.");
            // });
        // });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error.message})
    }
};

exports.loginUser = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        console.log(req.body);
    
        // 1. check if email and password exists
        if(!email || !password){
            return res.status(403).json({
                status: "fail",
                message: "Please provide and email and password"
            })
        }
        // 2. check if user has correct email & password
        const user = await User.findOne({ email }).select("+password");
    
        if(!user || !(await user.correctPassword(password, user.password))) {
            return res.status(403).json({
                status: "fail",
                message: "Incorrect email/password"
            })
        }
        if(user.isVerified === false){
            return res.status(403).json({
                message: "Please verify your email before signin"
            })
        }
        // 3. if everything is ok, send token to the client
        sendToken(user, 200, res);
    } catch(err){
        console.log(err);
        res.status(500).json({
            success: "false",
            message: "some error occured",

        })
    }
};

exports.currentUser = async (req, res) => {
    const token = req.header("Authorization");
    // console.log(token);
    
    const finalToken = token.split(" ")[1];
    if (!finalToken)
        return res.status(401).json({
            message: "You are not signed in"
        });
    const verified = jwt.verify(finalToken, process.env.JWT_SECRET);
    // console.log(verified.id);
    const user_ = await User.findById(verified.id);
    res.status(200).json({
        // message: "Congratulations the payment has been made successful", 
        user_
    })
            
}

exports.logoutUser = async (req, res, next) => {
    try{

        res.cookie("token", null, {
            expires: new Date( Date.now()),
            httpOnly: true,
        })
    
        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        })
    } catch(err) {
        console.log(err);
    }
};

async function sendVerificationEmail(user, req, res){
    try{
        const token = user.generateVerificationToken();
        // console.log(token);
        console.log(token);
        await token.save();
        let subject = "Account Verification Token";
        let to = user.email;
        let from = process.env.FROM_EMAIL;
        let link="http://"+req.headers.host+"/auth/verify/"+token.token;
        let html = `<p>Hi ${user.username}<p><br><p>Click on the following <a href="${link}">link</a> to verify your account.</p>`;
        console.log(link);
        await sendEmail({to, from, subject, html});
        res.status(201).json({message: 'Email has been sent to' + to});
    }catch (error) {
        res.status(500).json({message: error.message});
    }
}