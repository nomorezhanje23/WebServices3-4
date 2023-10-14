const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
    const validationRule = {
        diagnosis: 'required|string',
        medication: 'required|string',
        name: 'required|string',
        lastName: 'required|string',
        place: 'required|string',
        quantity:'string',
        payment: 'string'
    };
    validator(req.body, validationRule, {}, (err, status) => {
        if (!status) {
            res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
            });
        } else {
            next ()
        }
    });
};

module.exports = {
    saveUser
};