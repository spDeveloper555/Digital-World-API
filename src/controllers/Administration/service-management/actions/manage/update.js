class ManageServiceAction {
    async updateInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let findQuery = {
                status: 1
            }
            let finalData = {
                services: formData['services'],
                subServices: formData['subServices'],
                status: 1,
                updatedAt: Date.now()
            };
            await scope.db.update(findQuery, finalData, 'manage_service').catch((error) => { throw error })
            scope.res.status(201).json({ status: 'success', message: "Service details updated successfully." });
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to create service details." });
        }
    }
}
module.exports = ManageServiceAction;