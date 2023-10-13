const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req, res) => { 
    //#swagger.tags=['Hello to Health']
    res.send('Hello to Health');});

router.use('/users', require('./users'));

module.exports = router;