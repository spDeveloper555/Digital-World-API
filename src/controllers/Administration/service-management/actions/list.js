class ServiceDetailListAction {
    async listInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let findQuery = {
                status: 1,
            };
            if(formData?.['serviceDataID']) findQuery['serviceDataID'] = formData['serviceDataID'];
            else if (formData?.['search'] && formData['search'].length > 0) {
                let search = formData['search'];
                findQuery['$or'] = [
                    { serviceID: { $regex: search, $options: 'i' } },
                    { service: { $regex: search, $options: 'i' } },
                    { paymentType: { $regex: search, $options: 'i' } },
                    { date: { $regex: search, $options: 'i' } },
                    { amount: { $regex: search, $options: 'i' } }
                ]
            }
            let page = 1;
            let limit = 20;
            if(formData?.['page']) page = formData['page'];
            if(formData?.['limit']) limit = formData['limit'];
            let totalUserCount = await scope.db.count(findQuery, 'service_management');
            let options = { projection: { status: 0, createdAt: 0, _id: 0 }, page: page, limit: limit }
            let serviceDetails = await scope.db.find(findQuery, 'service_management', options).catch((error) => { throw error })
            let response = {
                status: 'success',
                data: serviceDetails,
                totalCount: totalUserCount
            }
            scope.res.status(201).json(response);
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to list service details." });
        }
    }
}
module.exports = ServiceDetailListAction;