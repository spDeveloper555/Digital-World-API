class UserListAction {
    async listInitProcess(scope) {
        try {
            let findQuery = {
                status: 1,
            };
            let totalUserCount = await scope.db.count(findQuery, 'user');
            let options = { projection: { status: 0, createdAt: 0, password: 0, _id: 0 } }
            let userList = await scope.db.find(findQuery, 'user', options).catch((error) => { throw error })
            let response = {
                status: 'success',
                data: userList,
                totalCount: totalUserCount
            }
            scope.res.status(201).json(response);
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create user." });
        }
    }
}
module.exports = UserListAction;