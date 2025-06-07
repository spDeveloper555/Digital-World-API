const CreateUserAction = require('./actions/create')
const UserListAction = require('./actions/list')
const DeleteUserAction = require('./actions/delete')
const TokenAuth = require('../../directives/TokenValidate')
class UserController {
    constructor(scope) {
        this.scopeObj = scope;
        this.createUser = new CreateUserAction();
        this.userList = new UserListAction();
        this.userDelete = new DeleteUserAction();
        this.token = new TokenAuth();
    }
    async create() {
        this.createUser.createInitProcess(this.scopeObj);
    }
    async list() {
        this.userList.listInitProcess(this.scopeObj);
    }
    async userDelete() {
        this.userDelete.deleteInitProcess(this.scopeObj);
    }
}
module.exports = UserController;

module.exports = [
    {
        path: "create",
        controller: UserController,
        action: "create",
        type: 'post'
    },
    {
        path: "list",
        controller: UserController,
        action: "list",
        type: 'post'
    },
    {
        path: "delete",
        controller: UserController,
        action: "delete",
        type: 'post'
    }
]