//Here we create functions that interact with database.

const db = require("../../database"); // require the database file
// const { getAll } = require("../controllers/articles.controllers");
//the function getAllArticles pulls all the articles from database and return them as an array
const getAllArticles = (done) => {
    const results = [];
    //get all the articles from database
    db.each(
        "SELECT * FROM articles", //SQL statement to execute
        [], //the output of first time checking the list

        (err, row) => {
            if (err) console.log("Something went wrong: " + err);

            results.push({ //records
                article_id: row.article_id,
                title: row.title,
                author: row.author,
                date_published: new Date(row.date_published).toLocaleDateString(),
                date_edited: new Date(row.date_edited).toLocaleDateString(),
                article_text: row.article_text
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    )
}

const addNewArticle = (article, done) => {
        let date = Date.now(); //acces the current date/time in JS
        //what data will be sent by the client, and the assesment specification shows what tables and columns there are in database
        const sql = 'INSERT INTO articles (title, author, date_published, date_edited, article_text, created_by) VALUES (?,?,?,?,?,?)';
        let values = [article.title, article.author, date, date, article.article_text, 1]; //extract implement authentification based on ID of the person who is logged in, default this value to 1
        //run() function map the sql and values togheter
        db.run(
            sql,
            values,
            function(err) {
                if (err) return done(err, null);

                return done(null, this.lastID); //this.lastID acces the primary key of the record that has just been added to the database,return the article ID to the client
            }
        )
    }
    //export functions so they can be accessed by other files
const getSingleArticle = (id, done) => {
    const sql = 'SELECT * FROM articles WHERE article_id=?' //comments where comment_id

    db.get(sql, [id], (err, row) => {
        if (err) return done(err)
        if (!row) return done(404) //if no row is found, send the digits 404 

        return done(null, {
            article_id: row.article_id,
            title: row.title,
            author: row.author,
            date_published: new Date(row.date_published).toLocaleDateString(),
            date_edited: new Date(row.date_edited).toLocaleDateString(),
            article_text: row.article_text
        })

    })
}

const updateArticle = (id, article, done) => {
    const sql = 'UPDATE articles SET title=?, author=?, article_text=? WHERE article_id=?'
    let values = [article.title, article.author, article.article_text, id];

    db.run(sql, values, (err) => {
        return done(err)
    })
}

const deleteArticle = (id, done) => {
    const sql = 'DELETE FROM articles WHERE article_id=?'
    let values = [id];

    db.run(sql, values, (err) => {
        return done(err)
    })
}
module.exports = {
    getAllArticles: getAllArticles,
    addNewArticle: addNewArticle,
    getSingleArticle: getSingleArticle,
    updateArticle: updateArticle,
    deleteArticle: deleteArticle
}