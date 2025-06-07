class UpdateServiceManageAction {
    async updateInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let requireField = ['name', 'mobileNo'];
            let ValidResult = scope.utility.formValidation(formData, requireField);
            if (!ValidResult['isValid']) throw ValidResult;
            let findQuery = {
                serviceDataID: formData['serviceDataID'],
                serviceID: formData['serviceID'],
                status: 1
            }
            let finalData = {
                name: formData['name'],
                email: formData['email'],
                mobileNo: formData['mobileNo'],
                address: formData['address'],
                city: formData['city'],
                state: formData['state'],
                pincode: formData['pincode'],
                smsType: formData['smsType'],
                updatedAt: Date.now()
            };
            await scope.db.update(findQuery, finalData, 'service_management').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Service details updated successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create service details." });
        }
    }
}
module.exports = UpdateServiceManageAction;