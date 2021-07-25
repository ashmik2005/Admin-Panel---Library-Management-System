const express = require('express')   
const Sequelize = require('sequelize')  

var Op = Sequelize.Op

// Import Models 
const categoryModel = require('../models').Category 
const userModel = require('../models').User 
const bookModel = require('../models').Book    
const dayModel = require('../models').DaySetting
const issueBookModel = require('../models').IssueBook

const router = express.Router() 

router.route('/admin/issue-book').get(async (req, res, next) => {   

    var days = await dayModel.findAll({
        where:{
            status: '1'
        }
    });

    var categories = await categoryModel.findAll({ 
        where:{ 
            status:{ 
                [Op.eq] : '1'
            }
        }
    }) 

    var users = await userModel.findAll({ 
        where:{ 
            status:{ 
                [Op.eq] : '1'
            }
        }
    })

    res.render('admin/issue-a-book', { 
        categories:categories, 
        users:users, 
        days : days
    })
}).post(async (req, res, next) => {   

    var is_book_issued = await issueBookModel.count({ 
        where:{ 
            userId:{ 
                [Op.eq] : req.body.dd_user
            }, 
            bookId:{ 
                [Op.eq] : req.body.dd_book
            }, 
            is_returned:{ 
                [Op.eq] : '0'
            }
        }
    }) 

    if (is_book_issued > 0) {  

        req.flash("error", "Book already issued to user") 
        res.redirect('/admin/issue-book')

    } else {  

        var count_books = await issueBookModel.count({ 
            where:{ 
                userId:{ 
                    [Op.eq] : req.body.dd_user
                },  
                is_returned:{ 
                    [Op.eq] : '0'
                }
            }
        }) 
    
        if (count_books >= 2) { 
            // DO NOT ISSUE BOOK TO THIS USER!!  
            req.flash("error", "Maximum Books allowed for each user is 2!") 
            res.redirect('/admin/issue-book')
    
        } else { 
            issueBookModel.create({ 
                categoryId : req.body.dd_category, 
                bookId : req.body.dd_book, 
                userId : req.body.dd_user, 
                days_issued  :req.body.dd_days
            }).then((status) => { 
                if (status) { 
                    req.flash("success", "Book issued successfully")
                } else { 
                    req.flash("error", "Book could not be issued")
                } 
        
                res.redirect('/admin/list-issue-book')
            })   
    
        }

    }
})    


router.get('/admin/list-issue-book', async (req, res, next) => {  

    var issueList = await issueBookModel.findAll({ 
        include:[ 
            { 
                model: categoryModel, 
                attributes: ["name"] 
            },
            { 
                model: bookModel, 
                attributes: ["name"]
            }, 
            { 
                model: userModel, 
                attributes: ["name", "email"]
            }
        ], 
        attributes: ["days_issued", "issued_date"], 
        where: { 
            is_returned:{ 
                [Op.eq] : '0'
            }
        }
    }) 

    res.render('admin/issue-history', { 
        list: issueList
    })
}) 

router.post('/admin/category-list-book', async (req, res, next) => { 

    var category_id = req.body.cat_id 

    var books = await bookModel.findAll({ 
        where:{ 
            categoryId:{ 
                [Op.eq] : category_id
            }
        }
    }) 


    return res.json({ 
        status: 1, 
        books: books
    }) 

})

module.exports = router