class ProfileViewAction {
    async viewInitProcess(scope) {
        try {
            const token = scope.req.headers['token'];
            if (!token) {
                return scope.res.status(401).json({ message: 'Unauthorized access' });
            }
            let tokenDecrypt = scope.utility.decrypt(token);
            let userObj = JSON.parse(tokenDecrypt)
            if (userObj?.['userID']) {
                let findQuery = {
                    email: userObj['email'],
                    userID: userObj['userID'],
                    status: 1
                }
                let options = { projection: { status: 0, createdAt: 0, password: 0, _id: 0 } }
                let userList = await scope.db.findOne(findQuery, 'user', options).catch((error) => { throw error })
                let response = {
                    status: 'success',
                    data: userList,
                }
                scope.res.status(201).json(response);
            } else throw JSON.stringify({ message: "Unauthorized access" })
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create user." });
        }
    }
}
module.exports = ProfileViewAction;