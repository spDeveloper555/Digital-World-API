const ProfileViewAction = require('./actions/view')
const TokenAuth = require('../../directives/TokenValidate')
class ProfileController {
    constructor(scope) {
        this.scopeObj = scope;
        this.view = new ProfileViewAction();
        this.token = new TokenAuth();
    }
    async profileView() {
        this.view.viewInitProcess(this.scopeObj);
    }
}
module.exports = ProfileController;

module.exports = [
    {
        path: "view",
        controller: ProfileController,
        action: "profileView",
        type: 'post'
    }
]