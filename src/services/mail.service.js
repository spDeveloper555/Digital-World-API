const nodemailer = require('nodemailer');
const mailConfig = {
    host: "smtp.mailgun.org",
    port: 465,
    username: "suryaprakash555dev@gmail.com",
    pssword: "dxzp bpzl wrcd ostq" //"xhhb irrn hktu gmnh"
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
                ...options,
                attachments: [
                    {
                        filename: 'sakthi e seva final.png',
                        path: 'src/assets/image/sakthi e seva final.png',
                        cid: 'logoimage'
                    }
                ]
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