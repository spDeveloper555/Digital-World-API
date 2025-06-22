class CashDetailListAction {
    async listInitProcess(scope) {
        try {
            let formData = scope.req.body;
            let findQuery = {
                status: 1,
            };
            if (formData?.['cashDataID']) findQuery['cashDataID'] = formData['cashDataID'];
            else if (formData?.['paymentID']) findQuery['paymentID'] = formData['paymentID'];
            else if (formData?.['search'] && formData['search'].length > 0) {
                let search = formData['search'];
                findQuery['$or'] = [
                    { paymentID: { $regex: search, $options: 'i' } },
                    { service: { $regex: search, $options: 'i' } },
                    { paymentType: { $regex: search, $options: 'i' } },
                    { date: { $regex: search, $options: 'i' } },
                    { amount: { $regex: search, $options: 'i' } },
                    { customerName: { $regex: search, $options: 'i' } },
                    { customerMobileNo: { $regex: search, $options: 'i' } }
                ]
            }
            let page = 1;
            let limit = 20;
            if (formData?.['page']) page = formData['page'];
            if (formData?.['limit']) limit = formData['limit'];
            let skip = (page - 1) * limit;
            let totalUserCount = await scope.db.count(findQuery, 'cash_management');
            let options = { projection: { status: 0, createdAt: 0, _id: 0 }, page: page, limit: limit, skip: skip, sort: { createdAt: -1 } }
            let cashDetails = await scope.db.find(findQuery, 'cash_management', options).catch((error) => { throw error })

            let response = {
                status: 'success',
                data: cashDetails,
                totalCount: totalUserCount
            }
            if (formData?.['paymentID']) {
                let query = {
                    status: 1,
                    mobileNo: cashDetails[0]['customerMobileNo']
                };
                response['customerInfo'] = await scope.db.findOne(query, 'customer_management', { projection: { _id: 0, name: 1, email: 1, mobileNo: 1, address: 1, city: 1, state: 1, pincode: 1 } }).catch((error) => { throw error })
            }
            scope.res.status(201).json(response);
        } catch (error) {
            scope.res.status((error?.['message']) ? 201 : 401).json({ status: 'failure', message: (error?.['message']) ? error['message'] : "Unable to list cash details." });
        }
    }
}
module.exports = CashDetailListAction;