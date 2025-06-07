const TokenAuth = require('./../../../directives/TokenValidate');
const CreateCashManageAction = require('./actions/create');
const CashDetailListAction = require('./actions/list');
const UpdateCashManageAction = require('./actions/update');
const DeleteCashManageAction = require('./actions/delete');
class CashManagementController {
    constructor(scope) {
        this.scopeObj = scope;
        this.token = new TokenAuth();
        this.cashDetailsCreate = new CreateCashManageAction();
        this.cashDetails = new CashDetailListAction();
        this.cashDetailsUpdate = new UpdateCashManageAction();
        this.cashDetailsDelete = new DeleteCashManageAction()
    }
    async create() {
        this.cashDetailsCreate.createInitProcess(this.scopeObj)
    }
    async list() {
        this.cashDetails.listInitProcess(this.scopeObj)
    }
    async update() {
        this.cashDetailsUpdate.updateInitProcess(this.scopeObj)
    }
    async delete() {
        this.cashDetailsDelete.deleteInitProcess(this.scopeObj)
    }
}
module.exports = CashManagementController;

module.exports = [
    {
        path: "cash_detail/create",
        controller: CashManagementController,
        action: "create",
        type: 'post'
    },
    {
        path: "cash_detail/list",
        controller: CashManagementController,
        action: "list",
        type: 'post'
    },
    {
        path: "cash_detail/update",
        controller: CashManagementController,
        action: "update",
        type: 'post'
    },
    {
        path: "cash_detail/delete",
        controller: CashManagementController,
        action: "delete",
        type: 'post'
    }
]