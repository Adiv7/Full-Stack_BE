const users = require("../models/users.models");

const isAuthenticated = function(req, res, next) {
    let token = req.get('X-Authorization');

    users.getIdFromToken(token, (err, id) => {
        console.log(token, id)
        if (err || id === null) {
            return res.sendStatus(401);
        }
        next();
    });
}

module.exports = {
    isAuthenticated: isAuthenticated,
}