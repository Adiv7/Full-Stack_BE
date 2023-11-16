const db = require("../../database"); // require the database file
const article = require("../../app/controllers/articles.controllers");

//getting all comments from a single article
const getAllComments = (id, done) => {
    const results = [];
    const sql = 'SELECT article_id=? FROM comments' // WHERE article_id=?/'SELECT * FROM comments WHERE comment_id=?'

    db.get(sql, [id], [], (err, row) => {

            if (err) console.log("Something went wrong: " + err);

            results.push({ //records
                article_id: row.article_id,
                comment_id: row.comment_id,
                date_published: new Date(row.date_published).toLocaleDateString(),
                comment_text: row.article_text,
                // article_id: row.article_id
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

// adding a new comment to an article selected(article_id)
const addNewComment = (comment_text, article_id, done) => {
    let date = Date.now();
    const sql = 'INSERT INTO comments (comment_text,date_published, article_id) VALUES (?,?,?)';
    let values = [comment_text, date, article_id];
    //run() function map the sql and values togheter
    db.run(
        sql,
        values,
        function(err) {
            if (err) return done(err, null);

            return done(null, this.lastID); //this.lastID acces the primary key of the record that has just been added to the database,return the comment ID to the client
        }
    )
}


const deleteComment = (id, done) => {
    const sql = 'DELETE FROM comments WHERE comment_id=?'
    let values = [id];

    db.run(sql, values, (err) => {
        return done(err)
    })
}

//export functions so they can be accessed by other files
module.exports = {
    getAllComments: getAllComments,
    addNewComment: addNewComment,
    deleteComment: deleteComment
}