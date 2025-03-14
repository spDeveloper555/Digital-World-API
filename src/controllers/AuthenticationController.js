const LoginAction = require('./actions/authentication/login');
const ForgotAction = require('./actions/authentication/forgot');
class AuthenticationController {
    constructor(scope){
        this.scopeObj = scope;
        this.sigin = new LoginAction();
        this.forgot = new ForgotAction();
    }
    login() {
        this.sigin.loginInitProcess(this.scopeObj)
    }
    forgotPassword(){
        this.forgot.forgotInitProcess(this.scopeObj)
    }
}
module.exports = AuthenticationController;

module.exports = [
    {
        path: "login",
        controller: AuthenticationController,
        action: "login",
        type: 'post'
    },
    {
        path: "forgotPassword",
        controller: AuthenticationController,
        action: "forgotPassword",
        type: 'post'
    }
]