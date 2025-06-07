class UpdateCashManageAction {
    async updateInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['service', 'paymentType'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let findQuery = {
                cashDataID: formData['cashDataID'],
                paymentID: formData['paymentID'],
                status: 1
            }
            let finalData = {
                service: formData['service'],
                paymentType: formData['paymentType'],
                date: formData['date'],
                amount: formData['amount'] ?? '',
                borrowerDetails: formData['customerID'] ?? '',
                processOperator: formData['processOperator'],
                updatedAt: Date.now()
            };
            await scope.db.update(findQuery, finalData, 'cash_management').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Cash details updated successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create cash details." });
        }
    }
}
module.exports = UpdateCashManageAction;