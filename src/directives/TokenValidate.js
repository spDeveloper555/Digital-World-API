class TokenAuth {
    async validation(scope) {
        const token = scope.req.headers['token'];
        if (!token) {
            return scope.res.status(401).json({ message: 'Unauthorized access' });
        }
        try {
            let tokenDecrypt = scope.utility.decrypt(token);
            let userObj = JSON.parse(tokenDecrypt)
            if (userObj?.['userID']) {
                let findQuery = {
                    email: formData['email'],
                    userID: formData['userID'],
                    status: 1
                }
                let isExistUser = await scope.db.count(findQuery, 'user');
                if (isExistUser) return { isValid: true };
                else scope.res.status(403).json({ message: 'Invalid token' });
            } else scope.res.status(403).json({ message: 'Invalid token' });
        } catch (error) {
            return scope.res.status(403).json({ message: 'Invalid token' });
        }
    }
}
module.exports = TokenAuth;
