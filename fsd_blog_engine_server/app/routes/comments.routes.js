const comments = require("../controllers/comments.controllers"); // import controller
const auth = require("../lib/authentication");

module.exports = function(app) {

    app.route("/articles/:article_id/comments")
        .get(comments.getAll)
        .post(comments.createComment);

    app.route("/comments/:comment_id")
        .delete(auth.isAuthenticated, comments.deleteComment);
}