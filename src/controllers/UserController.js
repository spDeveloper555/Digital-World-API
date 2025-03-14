const CreateUserAction = require('./actions/user/create')
const TokenAuth = require('./../directives/TokenValidate')
class UserController {
    constructor(scope) {
        this.scopeObj = scope;
        this.createUser = new CreateUserAction();
        this.token = new TokenAuth();
    }
    async create() {
        this.createUser.createInitProcess(this.scopeObj);
    }
}
module.exports = UserController;

module.exports = [
    {
        path: "create",
        controller: UserController,
        action: "create",
        type: 'post'
    }
]