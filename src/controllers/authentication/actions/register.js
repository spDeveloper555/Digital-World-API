class RegisterAction {
    async registerInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['firstName', 'lastName', 'email', 'password'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let userID = await scope.db.randomID('cash_management', 'userID')
            let finalData = {
                firstName: formData['firstName'],
                lastName: formData['lastName'],
                email: formData['email'],
                password: scope.utility.encrypt(formData['password']),
                userDataID: scope.utility.generateId(),
                userID: userID,
                mobileNo: formData['mobileNo'],
                status: 1,
                createdAt: Date.now()
            };
            let isExistEmail = await scope.db.count({ status: 1, email: formData['email'] }, 'user');
            if (isExistEmail > 0) throw new RangeError('Email already exists.')
            await scope.db.insert(finalData, 'user').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Register successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to register user." });
        }
    }
}
module.exports = RegisterAction;