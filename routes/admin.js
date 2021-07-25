const express = require('express')    

const Sequelize = require("sequelize");

var Op = Sequelize.Op;

// load models
var categoryModel = require("../models").Category;
var userModel = require("../models").User;
var bookModel = require("../models").Book; 

const { redirectHome, redirectLogin } = require('../middleware/redirect')

const router = express.Router() 

router.get("/admin", redirectLogin, async function(req, res, next){

    var total_categories = await categoryModel.count();
    var total_users = await userModel.count();
    var total_books = await bookModel.count();

    res.render("admin/dashboard",{
        users: total_users,
        categories: total_categories,
        books: total_books
    });
});


module.exports = router