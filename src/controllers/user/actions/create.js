class CreateUserAction {
    async createInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['firstName', 'lastName', 'email', 'password'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let userID = await scope.db.randomID('cash_management', 'userID');
            let finalData = {
                firstName: formData['firstName'],
                lastName: formData['lastName'],
                email: formData['email'],
                password: scope.utility.encrypt(formData['password']),
                userID: userID,
                userDataID: scope.utility.generateId(),
                mobileNo: formData['mobileNo'],
                address: formData['address'],
                city: formData['city'],
                state: formData['state'],
                country: formData['country'],
                pincode: formData['pincode'],
                status: 1,
                createdAt: Date.now()
            };
            let isExistEmail = await scope.db.count({ status: 1, email: formData['email']}, 'user');
            if(isExistEmail > 0) throw new RangeError('Email already exists.')
            await scope.db.insert(finalData, 'user').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "User create successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create user." });
        }
    }
}
module.exports = CreateUserAction;