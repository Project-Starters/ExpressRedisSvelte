import express from "express";
// import redis from "redis";
const redis = require('redis')
import crypto from "crypto";
import { uuid } from 'uuidv4';

const cors = require('cors');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');

const app = express();
const port = 8080; // default port to listen

var allowCrossDomain = function(req: any, res: any, next: any) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

// MIDDLE WARE
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: true
}));


// REDIS CLIENT
const client = redis.createClient({
    url: '',
    password: ''
});

client.connect()

// PASSPORT
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: "password" }, async (email: string, password: string, cb: (...args: any[]) => any) => {
    try{
        const d = await client.get(email)
        if (!d) return cb(null, false, { messages: `No user ${email}` })
        const user = JSON.parse(d)
        const hashString = Buffer.from(user.hash, "hex")
        const saltString = Buffer.from(user.salt, "hex")
    
        const hash = crypto.pbkdf2Sync(password, saltString, 310000, 32, 'sha256')
        // console.log(hash, hashString, saltString)
        if (!crypto.timingSafeEqual(hashString, hash)) {
            return cb(null, false, { messages: 'Incorrect username or password.' });
        }
        return cb(null, {email, ...user});
    
    }catch(e){
        return cb(null, false, {messages: "authentication error"})
    }
}));

passport.serializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
        cb(null, { id: user.id, email: user.email });
    });
});

passport.deserializeUser(function (user: any, cb: any) {
    process.nextTick(function () {
        return cb(null, user);
    });
});



app.use(session({
    secret: '',
    resave: true,
    saveUninitialized: true,
    domain : '*',
    cookie: { 
        maxAge: 60 * 60 * 1000 * 24 * 30
    } // 1 month
}));

app.use(passport.initialize());
app.use(passport.session());


/**
 * ROUTES
 */

// serve the website files from the same origin as the server
// const path = require('path');
// app.use('/', express.static(path.join(__dirname, '..', '..', 'website', 'build')))


app.get('/', async (req, res) => {
    let auth = false
    if(req.user){
        auth = true
    }
    res.send({ version: "2.0.0", auth: req.user != null, ok: true })
})

app.get('/user', async (req, res) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.send({ user: req.user, auth: req.user != null, ok: true })
    console.log(req.cookies)
})

app.post('/login/password', passport.authenticate('local', {
    successReturnToOrRedirect: '/user',
    failureRedirect: '/user',
    failureMessage: true
}))

app.post('/signup', async (req, res) => {
    var salt = crypto.randomBytes(16);

    const email = req.body.email
    const password = req.body.password
    console.log(email, password)
    if (await client.get(email) !== null) {
        return res.send({
            status: 400,
            message: "Email already in use",
            ok: false
        })
    }
    const hash = await crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256')
    client.set(email, JSON.stringify({ 
        hash: hash.toString('hex'), 
        salt: salt.toString('hex'),
        id: uuid()
    }))
    console.log("hash", hash)
    return res.send({
        message: "account successfully created",
        ok: true
    })
})
app.post('/logout', (req, res)=>{
    req.logout();
    res.send({ok: true})
})


// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});