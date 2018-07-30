const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const apiKey = process.env.SENDGRID_API_KEY

const app = express();
app.set('view engine', 'pug');

const store = []

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(session({
    secret: process.env.SESSION_COOKIE_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxage: 1000 * 60 * 30
    }
}))

app.get('/', function (req, res) {
    if (!req.session.user) {
        res.render('login')
        return
    }
    res.render('index', {
        // only latest 10 mail
        data: store.slice(0, 10)
    });
});

app.post('/', function (req, res) {
    if (req.body.apikey != apiKey) {
        res.render('login', {
            error: "Failed login"
        })
        return
    }
    req.session.user = {}
    res.redirect(302, "/");
});


app.post('/v3/mail/send', function (req, res) {
    // TODO: check auth
    const message = req.body
    message.sent_at = Date.now();
    store.unshift(message)
    res.status(202).end()
});

const port = process.env.PORT || 3030
app.listen(port, function () {
    console.log(`start app (port: ${port})`);
});