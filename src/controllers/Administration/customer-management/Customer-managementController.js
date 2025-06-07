const TokenAuth = require('./../../../directives/TokenValidate');
const CreateCustomerManageAction = require('./actions/create');
const CustomerDetailListAction = require('./actions/list');
const UpdateCustomerManageAction = require('./actions/update');
const DeleteCustomerManageAction = require('./actions/delete');
class CustomerManagementController {
    constructor(scope) {
        this.scopeObj = scope;
        this.token = new TokenAuth();
        this.customerDetailsCreate = new CreateCustomerManageAction();
        this.customerDetails = new CustomerDetailListAction();
        this.customerDetailsUpdate = new UpdateCustomerManageAction();
        this.customerDetailsDelete = new DeleteCustomerManageAction()
    }
    async create() {
        this.customerDetailsCreate.createInitProcess(this.scopeObj)
    }
    async list() {
        this.customerDetails.listInitProcess(this.scopeObj)
    }
    async update() {
        this.customerDetailsUpdate.updateInitProcess(this.scopeObj)
    }
    async delete() {
        this.customerDetailsDelete.deleteInitProcess(this.scopeObj)
    }
}
module.exports = CustomerManagementController;

module.exports = [
    {
        path: "customer_detail/create",
        controller: CustomerManagementController,
        action: "create",
        type: 'post'
    },
    {
        path: "customer_detail/list",
        controller: CustomerManagementController,
        action: "list",
        type: 'post'
    },
    {
        path: "customer_detail/update",
        controller: CustomerManagementController,
        action: "update",
        type: 'post'
    },
    {
        path: "customer_detail/delete",
        controller: CustomerManagementController,
        action: "delete",
        type: 'post'
    }
]