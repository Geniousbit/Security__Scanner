const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("");

function sendEmail(mailOptions) {

    return new Promise((resolve, reject) => {
        sgMail.send(mailOptions, (error, result) => {
            if (error){ 
                console.log(error);
                return reject(error);
            }
            return resolve(result);
        });
    });
}

module.exports = sendEmail;
