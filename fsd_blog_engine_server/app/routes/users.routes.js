const users = require("../controllers/users.controllers"); // import controller
const auth = require("../lib/authentication");
module.exports = function(app) {
    //endpoints
    app.route("/users")
        .get(auth.isAuthenticated, users.getUser)
        .post(auth.isAuthenticated, users.NewUser);

    app.route("/login")
        .post(users.loginUser);

    app.route("/logout")
        .post(auth.isAuthenticated, users.logoutUser);


}