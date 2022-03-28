const sgMail = require('@sendgrid/mail');

sgMail.setApiKey("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");

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