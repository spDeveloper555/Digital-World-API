class LoginAction {
    async loginInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['email', 'password'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let findQuery = {
                status: 1,
                email: formData['email'],
                password: scope.utility.encrypt(formData['password'])
            }
            let options = { projection: { status: 0, createdAt: 0, password: 0, _id: 0 } }
            let userData = await scope.db.findOne(findQuery, 'user', options).catch((error) => { throw error });
            if (userData?.['email'] && userData?.['userID']) {
                let tokenObj = {
                    email: userData['email'],
                    userID: userData['userID'],
                    createdAt: Date.now()
                }
                let token = scope.utility.encrypt(JSON.stringify(tokenObj));
                scope.res.status(201).json({ status: 'success', token: token, message: "Welcome to digital world." });
            } else throw new RangeError('Invalid credentials.')
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create user." });
        }
    }
}
module.exports = LoginAction;