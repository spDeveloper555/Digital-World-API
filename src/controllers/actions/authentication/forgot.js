class ForgotAction {
    async forgotInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['email'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let findQuery = {
                status: 1,
                email: formData['email'],
            }
            let options = { projection: { status: 0, createdAt: 0, password: 0, _id: 0 } }
            let userData = await scope.db.findOne(findQuery, 'user', options).catch((error) => { throw error });
            if (userData?.['email'] && userData?.['userID']) {
                let emailOption = {
                    to: userData['email'],
                    subject: "Digital World - Forgot password",
                    html: '<div><p>Hi ' + userData['firstName'] + ' ' + userData['lastName'] + '</p><p>&nbsp;&nbsp;&nbsp;&nbsp;We received a request to reset your password for your Digital world account. If you made this request, please click the link below to reset your password:</p></br><a>Click here...</a></br><p>If you didn’t request a password reset, you can ignore this email your password will remain unchanged.</p><p>For security reasons, this link will expire in 30 minutes.</p></br><p>If you have any questions, feel free to contact our support team at sppromantus@gmail.com.</p></br><p>Thanks,</p><p>The Digital World Team</p></br><p>Note: This is a system generated email Please do not reply to this email.</p></div>'
                };
                let result = await scope.smtpMail(emailOption)
                if (result) scope.res.status(201).json({ status: 'success', message: "Mail sent successfully." });
            } else throw new RangeError('Invalid credentials.')
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create user." });
        }
    }
}
module.exports = ForgotAction;