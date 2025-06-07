const AuthenticationController = require("../controllers/authentication/AuthenticationController");
const UserController = require("../controllers/user/UserController");
const ProfileController = require("../controllers/profile/ProfileController")
const CashManagementController = require("../controllers/Administration/cash-management/Cash-managementController")
const CustomerManagementController = require("../controllers/Administration/customer-management/Customer-managementController")
module.exports = [
    {
        path : 'api',
        children:  AuthenticationController
    },
    {
        path : 'api/user',
        children:  UserController
    },
    {
        path : 'api/administration',
        children:  CashManagementController
    },
    {
        path : 'api/administration',
        children:  CustomerManagementController
    },
    {
        path : 'api/profile',
        children:  ProfileController
    }
];

