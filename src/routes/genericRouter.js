const AuthenticationController = require("../controllers/AuthenticationController");
const UserController = require("./../controllers/UserController")
module.exports = [
    {
        path : 'api',
        children:  AuthenticationController
    },
    {
        path : 'api/user',
        children:  UserController
    }
    // {
    //     path: 'login',
    //     controller : AuthenticationController,
    //     action: "login",
    //     type : 'post'  
    // }
];

