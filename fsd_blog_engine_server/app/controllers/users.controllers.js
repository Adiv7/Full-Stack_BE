const users = require("../models/users.models");
const Joi = require("joi");
const { json } = require("body-parser");

const getUser = (req, res, next) => {
        users.getAllUsers((err, num_rows, results) => {
            if (err) {
                console.log(err)
                return res.sendStatus(500);
            }
            return res.status(201).send(results);
        })
    }
    // bad words filter, stops user use bad words
var Filter = require('bad-words');
var filter = new Filter({ placeHolder: 'x' });

console.log(filter.clean("Don't be an ash0le")); //Don't be an xxxxxx

const NewUser = (req, res, next) => {
        //Joi validates the incoming data against the specification
        const schema = Joi.object({
            "first_name": Joi.string().required(),
            "last_name": Joi.string().required(),
            "email": Joi.string().email().required(),
            "password": Joi.string().pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,16}$/).required()
        });

        console.log("hi");
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message); //return 400 Bad request if data doesn't validate
        //gets the article data out of req.body,and sends it to the model function that we have just created
        let temp_user = Object.assign({}, req.body);
        //call the addNewArticle function
        users.addNewUser(temp_user, (err, id) => {
            if (err) return res.sendStatus(500);

            return res.status(201).send({ user_id: id })
        })
    }
    //check if user isn't alrady logged in

//login method
const loginUser = (req, res) => {

        const schema = Joi.object({
            "email": Joi.string().email().required(),
            "password": Joi.string().required()
        })
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        users.authenticateUser(req.body.email, req.body.password, (err, id) => {
            if (err === 404) return res.status(400).send("Invalid email/password supplied")
            if (err) return res.sendStatus(500)

            users.getToken(id, (err, token) => {
                if (err) return res.sendStatus(500)

                if (token) {
                    return res.status(200).send({ user_id: id, session_token: token })
                } else {
                    users.setToken(id, (err, token) => {
                        if (err) return res.sendStatus(500)
                        return res.status(200).send({ user_id: id, session_token: token })
                    })
                }
            })
        })
    }
    //logout method
const logoutUser = (req, res, next) => {
    let token = req.get('X-Authorization');
    users.removeToken(token, (err) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500)
        }
        return res.status(200).send("User logged out.");
    })
}



module.exports = {
    getUser: getUser,
    NewUser: NewUser,
    loginUser: loginUser,
    logoutUser: logoutUser,

}