const User = require("../Models/user");

const checkSubscription = async () => {
  const allUsers = await User.find({});
  var dateNow = new Date().getTime().toString();
  allUsers.map((user) => {
    if (!user.isEmailSent && dateNow >= user.remainderDate) {
      (async function () {
        await User.findByIdAndUpdate(user._id, {
          isEmailSent: true,
        });
      });
      //send email
    }
  });
};

module.exports = checkSubscription;
