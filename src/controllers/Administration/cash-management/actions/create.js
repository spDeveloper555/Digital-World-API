class CreateCashManageAction {
    async createInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['invoice_details'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let cashDetailsID = await scope.db.generateOrderID('cash_management', 'paymentID');
            for (let item of formData['invoice_details']) {
                let finalData = {
                    paymentID: cashDetailsID,
                    cashDataID: scope.utility.generateId(),
                    service: item['service'],
                    subService: item['subService'] ?? '',
                    ReferenceID: item['ReferenceID'] ?? '',
                    paymentType: item['paymentType'],
                    date: item['date'],
                    amount: item['amount'] ?? '',
                    paymentMode: item['paymentMode'] ?? '',
                    processOperator: item['processOperator'],
                    customerName: item['customerName'],
                    customerMobileNo: item['customerMobileNo'],
                    status: 1,
                    createdAt: Date.now()
                };
                await scope.db.insert(finalData, 'cash_management').catch((error) => { throw error })
            }
            let query = {
                status: 1,
                mobileNo: formData['invoice_details'][0]['customerMobileNo']
            };
            let updateData = {
                status: 1,
                mobileNo: formData['invoice_details'][0]['customerMobileNo'],
                name: formData['invoice_details'][0]['customerName'],
            }
            await scope.db.update(query, updateData, 'customer_management').catch((error) => { throw error })
            let customerInfo = await scope.db.findOne(query, 'customer_management', { projection: { _id: 0, name: 1, email: 1, mobileNo: 1, address: 1, city: 1, state: 1, pincode: 1 } }).catch((error) => { throw error })
            if(Object.keys(customerInfo).length == 0) customerInfo = { mobileNo: formData['invoice_details'][0]['customerMobileNo']}
            let response = {
                status: 'success',
                invoiceID: cashDetailsID,
                customerInfo: customerInfo,
                message: "Cash details created successfully."
            }
            scope.res.status(201).json(response);
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create cash details." });
        }
    }
}
module.exports = CreateCashManageAction;