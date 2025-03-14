const nodemailer = require('nodemailer');
const mailConfig = {
    host: "smtp.mailgun.org",
    port: 465,
    username: "sppromantus@gmail.com",
    pssword: "xhhb irrn hktu gmnh"
};

const smtpMail = async (options) => {
    return new Promise((resolve, reject) => {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: mailConfig['username'],
                    pass: mailConfig['pssword'],
                },
                tls: {
                    rejectUnauthorized: false,
                },
                port: mailConfig['port'],
                secure: true,
                requireTLS: true,
                secured: true
            });

            // Email options
            const mailOptions = {
                from: '"Digital World" <sppromantus@gmail.com>',
                ...options
            };
            // Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    reject(error);
                }
            });
            resolve(1);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = smtpMail;