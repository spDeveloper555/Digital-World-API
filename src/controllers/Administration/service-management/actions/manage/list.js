class ManageServiceListAction {
    async listInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let findQuery = {
                status: 1,
            };

            let options = { projection: { _id: 0 } }
            let serviceDetails = await scope.db.findOne(findQuery, 'manage_service', options).catch((error) => { throw error })
            let response = {
                status: 'success',
            }
            if (formData?.['isList']) {
                response['services'] = serviceDetails['services'] || [{ service: '', amount: '' }];
                response['subServices'] = serviceDetails['subServices'] || [{ subService: '' }];
            } else {
                if(serviceDetails?.['services'] && serviceDetails['services'].length > 0) {
                    response['services'] = serviceDetails['services'].reduce((acc, item) => {
                        acc[item.service] = item.amount;
                        return acc;
                    }, {});
                }
                if(serviceDetails?.['subServices'] && serviceDetails['subServices'].length > 0) {
                    response['subServices'] = serviceDetails['subServices'].map(item => item.subService);
                }
            }

            scope.res.status(201).json(response);
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to list service details." });
        }
    }
}
module.exports = ManageServiceListAction;