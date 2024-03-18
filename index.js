require("dotenv").config();
const express = require("express");
const path = require("path")
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require("cors");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const AuthRoute = require("./route/authRoute");
const UserRoute = require("./route/userRoute");
const UrlRoute = require("./route/urlRoute");
const RedirectRoute = require("./route/redirectRoute");
const ErrorHandler = require("./middleware/ErrorHandler");
const { authenticateUser } = require("./middleware/authentication");
const { ForbiddenError } = require("./middleware/Error");
const rateLimit = require("./middleware/limiter");

const app = express();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(rateLimit);
const whitelist = [
  "https://tittle.onrender.com",
  "https://tittle.stoplight.io",
  "http://localhost:8000",
];
app.use(
  cors({
    origin: whitelist,
    headers: ["Content-Type"],
    credentials: true,
  })
  );
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24,
    }),
  }));
app.use(cookieParser())
app.use(express.static('public'));
app.use(flash());
app.set('views', path.join('views'))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('signup', {
    signupFlash: req.flash('signupFail')
  });
})
app.get('/login', (req, res) => {
  res.render('login', {
    loginFlash: req.flash('loginFail')
  });
});
app.get('/api/shortify', authenticateUser, (req, res) => {
  res.render('home', {
    invalidFlash: req.flash('urlInvalid'),
    user: req.User
  });
});
app.get('/api/dashboard', authenticateUser, (req, res) => {
  res.render('dashboard', {
    user: req.User
  });
});
app.get('/logout', authenticateUser, (req, res) => {
  res.clearCookie("token");
  res.redirect('/login');
});
app.get('/api/user/update/:id', authenticateUser, (req, res) => {
  res.render('settings', {
    user: req.User,
    updateFlash: req.flash('updateSuccess')

  });
});
app.get('/api/user/delete/:id', authenticateUser, (req, res) => {
  res.render('deactivate', {
    user: req.User.id
  });

});

app.use("/", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/shortify", UrlRoute);
app.use("/", RedirectRoute)

app.use(function (err, req, res, next) {
  ErrorHandler(err, req, res);
});

app.use("*", () => {
  throw new ForbiddenError("Invalid Request: Route Not Found")

});



module.exports = app;
