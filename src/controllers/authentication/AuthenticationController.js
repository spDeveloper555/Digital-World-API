const LoginAction = require('./actions/login');
const RegisterAction = require('./actions/register');
const ForgotAction = require('./actions/forgot');
class AuthenticationController {
    constructor(scope){
        this.scopeObj = scope;
        this.signin = new LoginAction();
        this.signup = new RegisterAction();
        this.forgot = new ForgotAction();
    }
    login() {
        this.signin.loginInitProcess(this.scopeObj)
    }
    forgotPassword(){
        this.forgot.forgotInitProcess(this.scopeObj)
    }
    register() {
        this.signup.registerInitProcess(this.scopeObj)
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
    },
    {
        path: "register",
        controller: AuthenticationController,
        action: "register",
        type: 'post'
    },
]