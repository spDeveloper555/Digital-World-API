class CreateCustomerManageAction {
    async createInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['name', 'mobileNo'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let customerDetailsID = await scope.db.randomID('customer_management', 'customerID')
            let finalData = {
                name: formData['name'],
                fatherName: formData['fatherName'],
                email: formData['email'],
                mobileNo: formData['mobileNo'],
                address: formData['address'],
                city: formData['city'],
                state: formData['state'],
                pincode: formData['pincode'],
                smsType: formData['smsType'],
                customerID: customerDetailsID,
                customerDataID: scope.utility.generateId(),
                status: 1,
                createdAt: Date.now()
            };
            await scope.db.insert(finalData, 'customer_management').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Customer details created successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create customer details." });
        }
    }
}
module.exports = CreateCustomerManageAction;