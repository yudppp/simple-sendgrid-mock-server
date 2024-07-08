const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const apiKey = process.env.SENDGRID_API_KEY || "secret";
const fetchLimit = parseInt(process.env.SENDGRID_FETCH_LIMIT) || 10

const app = express();
app.set("view engine", "pug");

const store = [];

const maxRequestBodySize = process.env.MAX_BODY_SIZE || "10mb";
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: maxRequestBodySize
  })
);
app.use(
  bodyParser.json({
    limit: maxRequestBodySize
  })
);

app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxage: 1000 * 60 * 30
    }
  })
);

app.get("/", function (req, res) {
  if (!req.session.user) {
    res.render("login");
    return;
  }
  res.render("index", {
    data: store
  });
});

app.get("/json", function (req, res) {
  const token = req.query.token;
  if (token != apiKey) {
    res.status(401).send("Unauthorized");
    return;
  }
  res.send(store);
});

app.post("/", function (req, res) {
  if (req.body.apikey != apiKey) {
    res.render("login", {
      error: "Failed login"
    });
    return;
  }
  req.session.user = { };
  res.redirect(302, "/");
});

app.post("/v3/mail/send", function (req, res) {
  // TODO: check auth
  const { content, ...message } = req.body;
  message.sent_at = Date.now();
  const personalize = (message, substitutions) => {
    return Object.keys(substitutions).reduce((value, key) => {
      return value.split(key).join(substitutions[key]);
    }, message)
  }
  const messages = message.personalizations.map(
    ({ substitutions = { }, ...personalization }) => {
      return {
        ...message,
        subject: personalize(personalization.subject || message.subject, substitutions),
        content: content.map(c => {
          if (!c.value) return c;
          return {
            ...c,
            // resolve substitutions
            value: personalize(c.value, substitutions)
          };
        }),
        personalizations: [personalization],
        attachments: message?.attachments ??[]
      };
    }
  );
  store.unshift(...messages);
  store.splice(fetchLimit);
  res.status(202).end();
});

const port = process.env.PORT || 3030;
app.listen(port, function () {
  console.log(`start app (port: ${port})`);
});
