const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello People!');});

module.exports = router;