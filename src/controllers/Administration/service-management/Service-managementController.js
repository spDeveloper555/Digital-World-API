const TokenAuth = require('../../../directives/TokenValidate');
const CreateServiceManageAction = require('./actions/create');
const ServiceDetailListAction = require('./actions/list');
const UpdateServiceManageAction = require('./actions/update');
const DeleteServiceManageAction = require('./actions/delete');
class ServiceManagementController {
    constructor(scope) {
        this.scopeObj = scope;
        this.token = new TokenAuth();
        this.serviceDetailsCreate = new CreateServiceManageAction();
        this.serviceDetails = new ServiceDetailListAction();
        this.serviceDetailsUpdate = new UpdateServiceManageAction();
        this.serviceDetailsDelete = new DeleteServiceManageAction()
    }
    async create() {
        this.serviceDetailsCreate.createInitProcess(this.scopeObj)
    }
    async list() {
        this.serviceDetails.listInitProcess(this.scopeObj)
    }
    async update() {
        this.serviceDetailsUpdate.updateInitProcess(this.scopeObj)
    }
    async delete() {
        this.serviceDetailsDelete.deleteInitProcess(this.scopeObj)
    }
}
module.exports = ServiceManagementController;

module.exports = [
    {
        path: "Service_detail/create",
        controller: ServiceManagementController,
        action: "create",
        type: 'post'
    },
    {
        path: "Service_detail/list",
        controller: ServiceManagementController,
        action: "list",
        type: 'post'
    },
    {
        path: "Service_detail/update",
        controller: ServiceManagementController,
        action: "update",
        type: 'post'
    },
    {
        path: "Service_detail/delete",
        controller: ServiceManagementController,
        action: "delete",
        type: 'post'
    }
]