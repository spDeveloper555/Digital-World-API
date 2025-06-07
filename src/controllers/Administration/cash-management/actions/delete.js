class DeleteCashManageAction {
    async deleteInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let findQuery = {
                cashDataID: formData['cashDataID'],
                status: 1
            }
            let finalData = {
                status: 0,
                deletedAt: Date.now()
            };
            
            await scope.db.update(findQuery, finalData, 'cash_management').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Cash details deleted successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create cash details." });
        }
    }
}
module.exports = DeleteCashManageAction;