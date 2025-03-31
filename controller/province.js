const provinceModel = require('../models/province');

exports.getProvince = async (req,res) => {
    try {
        const province = req.params.name;
        const single_province = await provinceModel.findOne({name_th:province});
        res.json({province:single_province});
    } catch (error) {
        res.json({err:"Something went wrong at server side"});
        console.log(error);
    }
}