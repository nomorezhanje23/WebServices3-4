const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello People!');});

router.use('/users', require('./users'));

module.exports = router;