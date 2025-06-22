const TokenAuth = require('../../../directives/TokenValidate');
const CreateServiceManageAction = require('./actions/create');
const ServiceDetailListAction = require('./actions/list');
const UpdateServiceManageAction = require('./actions/update');
const DeleteServiceManageAction = require('./actions/delete');
const ManageServiceAction = require('./actions/manage/update');
const ManageServiceListAction = require('./actions/manage/list');
class ServiceManagementController {
    constructor(scope) {
        this.scopeObj = scope;
        this.token = new TokenAuth();
        this.serviceDetailsCreate = new CreateServiceManageAction();
        this.serviceDetails = new ServiceDetailListAction();
        this.serviceDetailsUpdate = new UpdateServiceManageAction();
        this.serviceDetailsDelete = new DeleteServiceManageAction()
        this.manageServiceAction = new ManageServiceAction();
        this.manageServiceListAction = new ManageServiceListAction();
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
    async manageList() {
        this.manageServiceListAction.listInitProcess(this.scopeObj)
    }
    async manageUpdate() {
        this.manageServiceAction.updateInitProcess(this.scopeObj)
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
    },
    {
        path: "manage_service/list",
        controller: ServiceManagementController,
        action: "manageList",
        type: 'post'
    },
    {
        path: "manage_service/update",
        controller: ServiceManagementController,
        action: "manageUpdate",
        type: 'post'
    }
]