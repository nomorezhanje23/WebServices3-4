const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
//const dotenv = require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const port = process.env.PORT || 3001;

const app = express();

// Middleware setup
app
    .use(bodyParser.json()) // Parse incoming JSON requests
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true,
    })) // Initialize express-session
    .use(passport.initialize()) // Initialize Passport for authentication
    .use(passport.session()) // Allow Passport to use express-session
    .use((req, res, next) => {
        // Enable CORS (Cross-Origin Resource Sharing)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
        );
        res.setHeader(
            'Access-Control-Allow-Methods',
            'POST, GET, PUT, PATCH, OPTIONS, DELETE'
        );
        next();
    })
    .use(cors({ METHODS: ['GET','POST','DELETE','UPDATE','PUT','PATCH']})) // Enable CORS for specific HTTP methods
    .use(cors({ origin: '*'})) // Enable CORS for all origins
    .use("/", require("./routes/index.js")); // Mount the API routes);

// Configure Passport to use GitHub OAuth strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
    // Handle GitHub authentication, in this case, return the user's profile
    return done(null, profile);
}));

// Handle uncaught exceptions
process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\nException origin: ${origin}`);
});

// Serialize and deserialize Passport user data
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.displayName}` : "Logged Out");
});

// Define a route for GitHub OAuth callback
app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
}), (req, res) => {
    // Store user data in the session and redirect to the root URL
    req.session.user = req.user;
    res.redirect('/');
});

mongodb.initDb((err) => {
    if(err){
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and node Running on port ${port}`)})
    }
});

