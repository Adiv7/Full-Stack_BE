const comments = require("../models/comments.models");
const Joi = require("joi");
const articles = require("../models/articles.models")

const getAll = (req, res) => {
    let article_id = parseInt(req.params.comments_id);

    comments.getAllComments(article_id, (err, num_rums, results) => {
        if (err) return res.sendStatus(500);

        return res.status(200).send(results);
    })

}

const createComment = (req, res) => {
    //Joi validates the incoming data against the specification

    const schema = Joi.object({
        "comment_text": Joi.string().required()
    })
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let comment = Object.assign({}, req.body);
    let article_id = parseInt(req.params.article_id)

    articles.getSingleArticle(req.params.article_id, (err, id) => {
        if (err === 404) return res.sendStatus(404);
        if (err) return res.sendStatus(500);
        else {
            comments.addNewComment(req.body.comment_text, article_id, (err, id) => {
                if (err) return res.sendStatus(500);

                return res.status(201).send({ comment_id: id })
            })
        }
    })
}

const deleteComment = (req, res, next) => {
        let comment_id = parseInt(req.params.comment_id);
        comments.getAllComments(comment_id, (err, result) => {
            if (err === 404) return res.sendStatus(404);
            if (err) return res.sendStatus(500);
        })
        comments.deleteComment(comment_id, (err, id) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500)
            }
            return res.status(200).send("Comment deleted")

        })

    }
    //export functions so they can be accessed by other files
module.exports = {
    getAll: getAll,
    createComment: createComment,
    deleteComment: deleteComment
}