const db = require('./db');

const Sequelize = require('sequelize');

const models = require('./models');
models.forEach((model) => {
    model(db, Sequelize);
});

// db.sync()
// ----------------------------
// db.sync({ force: true }).then(() => {
//     require('./dbsync');
// });

const express = require('express');
const app = express();
const bodyparser = require('body-parser').urlencoded({ extended: true });
const session = require('express-session');
const passport = require('passport');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

let sessionInfo = {
    secret: '__ADD_SECRET_HERE__',
    resave: false,
    store: new SequelizeStore({
        db: db,
    }),
    cookie: {
        path: '/',
        maxAge: 1000 * 60 * 24,
    },
};
// app.use(
//     session({
//         secret: 'yoursecret',
//         cookie: {
//             path: '/',
//             maxAge: 1000 * 60 * 24 // 24 hours
//         }
//     })
// );
var cors = require('cors');

(() => {
    require('./passport')(passport);
    app.use(bodyparser);
    app.use(session(sessionInfo));
    app.use(passport.initialize());
    app.use(passport.session());
    // app.use(cors())
})();

const config = require('./config');
if (config.debug)
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header(
            'Access-Control-Allow-Headers',
            'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
        );
        next();
    });

const PORT = 90;
const api = require('./api');
app.use('/api', api);

app.listen(PORT, () => {
    console.log(`[+] Servert started on ${PORT}`);
});
const path = require('path');

app.use(express.static('build'));
app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/editor', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
