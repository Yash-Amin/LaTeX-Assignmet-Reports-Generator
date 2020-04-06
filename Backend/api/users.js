const router = require('express').Router();
const passport = require('passport');
const auth = require('./authMiddleware');
const Error = require('./error');
const User = require('../functions/users');
var bodyparser = require('body-parser').json();
router.use(bodyparser);

const { check, validationResult } = require('express-validator/check');
const UserModel = require('../models/Users');

router.post('/login', (req, res) => {
    // console.log(req.body);
    console.log('[+] Log in', req.body.email, req.connection.remoteAddress)
    passport.authenticate('local', function(err, user, info) {
        if (err || info) {
            return res.status(400).json(Error(info.message));
        }
        if (!user) {
            return res.status(400).json(info);
        }
        req.login(user, loginError => {
            if (loginError) return res.status(400).json(Error(loginError));
            console.log('Logged in')
            res.json({message: 'Logged in'});
        });
    })(req, res);
});

router.post(
    '/register',
    [
        check('email')
            .trim()
            .not()
            .isEmpty(),
        check('password')
            .not()
            .isEmpty()
            .isLength({ min: 3 })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(422)
                .json({ error: true, message: errors.array() });
        }

        const email = String(req.body.email).trim();
        const password = String(req.body.password);

        if (
            !(
                (String(req.body.email).startsWith('17ce') ||
                    String(req.body.email).startsWith('d18ce')) &&
                String(req.body.email).endsWith('@charusat.edu.in')
            )
        ) {
            return res
                .status(422)
                .json(Error('Use charusat email. [17ce || d18ce]'));
        }

        const userAuthObj = { email, password };

        User.createUser(userAuthObj, (err, dbUser) => {
            if (err) {
                return res.status(400).json(err);
            }

            res.json(Error());
        });
    }
);

router.post('/logout', (req, res) => {
    if (req.user) {
        req.logout();
        res.end();
        console.log('Logged out!')
    } else {
        res.status(400).json(Error());
    }
});

router.get('/', auth, (req, res) => {
    User.getUser(req.user.email, (err, data) => {
        if (err || !data) {
            return res.status(500).json(err);
        } else {
            res.json({ email: data.email });
        }
    });
});

module.exports = router;
