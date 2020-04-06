const Error = require('./error');

module.exports = function(req, res, next) {
    console.log('[>] ', req.user ? req.user.email : 'False');
    if (req.user) {
        next();
    } else {
        res.status(403).json(Error('Login required.'));
    }
};
