class CreateServiceManageAction {
    async createInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['name', 'mobileNo'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let serviceDetailsID = await scope.db.randomID('service_management', 'serviceID')
            let finalData = {
                name: formData['name'],
                email: formData['email'],
                mobileNo: formData['mobileNo'],
                address: formData['address'],
                city: formData['city'],
                state: formData['state'],
                pincode: formData['pincode'],
                smsType: formData['smsType'],
                serviceID: serviceDetailsID,
                serviceDataID: scope.utility.generateId(),
                status: 1,
                createdAt: Date.now()
            };
            await scope.db.insert(finalData, 'service_management').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "service details created successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create service details." });
        }
    }
}
module.exports = CreateServiceManageAction;