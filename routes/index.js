const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

//router.get('/', (req, res) => { 
    //#swagger.tags=['Hello to Health']
    //res.send('Hello to Health');});

router.use('/users', require('./users'));

// Route for user login using GitHub OAuth
router.get('/login', passport.authenticate('github'), (req, res) => {});

// Route for user logout
router.get('/logout', function (req, res, next) {
    req.logOut(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});


module.exports = router;