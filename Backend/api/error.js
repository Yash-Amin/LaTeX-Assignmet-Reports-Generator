module.exports = function(s) {
    if (!s) {
        return { error: false };
    }
    return { error: true, message: s };
};
