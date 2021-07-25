const express = require('express')    
const Sequelize = require('sequelize')

// Load Category Model 
var categoryModel = require('../models').Category;  
var bookModel = require('../models').Book 
var optionModel = require('../models').Option 

const Op = Sequelize.Op

const router = express.Router() 

router.route('/admin/add-book').get(async (req, res, next) => {  

    var categories = await categoryModel.findAll({ 
        where:{ 
            status: { 
                [Op.eq] : '1'
            }
        }
    }) 

    var currency_data = await optionModel.findOne({ 
        where:{ 
            option_name:{ 
                [Op.eq] : "active_currency" 
            }
        }
    })

    res.render('admin/add-book', { 
        categories : categories, 
        currency_data : currency_data
    })
}).post((req, res, next) => { 

    if(!req.files) { 
        req.flash("error", "Please Upload a file")
    } else{ 
        var image_attr = req.files.cover_image   

        var valid_extensions = ["image/png", "image/jpg", "image/jpeg"] 

        if (valid_extensions.includes(image_attr.mimetype)) {  
            image_attr.mv("./public/uploads/" + image_attr.name) 

        bookModel.create({ 
            name : req.body.name, 
            categoryId : req.body.dd_category, 
            description : req.body.description, 
            amount : req.body.amount, 
            cover_image : "/uploads/" + image_attr.name, 
            author : req.body.author, 
            status : req.body.status
        }).then((status) => { 
            if (status) { 
                // DB Insert Successful 
                req.flash("success", "Book has been created")
            } else { 
                // DB Insert went wrong 
                req.flash("error", "Failed to create Book")
            } 

            res.redirect('/admin/add-book')
        }) 

        

        } else { 
            req.flash("error", "Invalid File Format") 
            res.redirect('/admin/add-book')
        }

        // Uploading image to public/uploads 
        

      //  res.json(image_attr)
    }

})  

router.get('/admin/list-book', async (req, res, next) => {  

    var books = await bookModel.findAll({ 
        include: { 
            model: categoryModel, 
            attributes: ["name"]
        }
    }) 

    var currency_data = await optionModel.findOne({ 
        where:{ 
            option_name:{ 
                [Op.eq] : "active_currency" 
            }
        }
    })


    res.render('admin/list-book', { 
        books: books, 
        currency_data : currency_data
    })
}) 

router.route('/admin/edit-book/:bookId').get(async (req, res, next) => { 
    
    var book_data = await bookModel.findOne({ 
        where: { 
            id:{ 
                [Op.eq] : req.params.bookId
            }
        }
    })   

    var currency_data = await optionModel.findOne({ 
        where:{ 
            option_name:{ 
                [Op.eq] : "active_currency" 
            }
        }
    })

    var categories = await categoryModel.findAll({ 
        where:{ 
            status: { 
                [Op.eq] : '1'
            }
        }
    })  

    res.render('admin/edit-book', { 
        book: book_data, 
        categories: categories, 
        currency_data:currency_data
    })
}).post((req, res, next) => { 
    if (!req.files) { 
        // Cover Image not updated 
        bookModel.update({ 
            name : req.body.name, 
            categoryId : req.body.dd_category, 
            description : req.body.description, 
            amount : req.body.amount, 
            author : req.body.author, 
            status : req.body.status
        }, { 
            where:{ 
                id:{ 
                    [Op.eq]: req.params.bookId
                }
            }
        }).then((status) => { 
            if (status) { 
                req.flash("success", "Book updated successfully")
            } else { 
                req.flash("error", "Failed to update book")
            } 
            
            res.redirect('/admin/edit-book/' + req.params.bookId) 
        })
    } else {

        // going to update cover image

        var image_attr = req.files.cover_image;

        var valid_images_extensions = ["image/png", "image/jpg", "image/jpeg"];

        if (valid_images_extensions.includes(image_attr.mimetype)) {

            image_attr.mv("./public/uploads/" + image_attr.name);

            bookModel.update({
                name: req.body.name,
                categoryId: req.body.dd_category,
                description: req.body.description,
                amount: req.body.amount,
                cover_image: "/uploads/" + image_attr.name,
                author: req.body.author,
                status: req.body.status
            }, {
                where: {
                    id: {
                        [Op.eq]: req.params.bookId
                    }
                }
            }).then((data) => {

                if (data) {
                    // saved
                    req.flash("success", "Book has been updated successfully");
                } else {
                    // not saved
                    req.flash("error", "Failed to update book");
                }

                res.redirect("/admin/edit-book/" + req.params.bookId);
            })

            //res.json(image_attr);
        } else {

            req.flash("error", "Invalid file format");
            res.redirect("/admin/edit-book/" + req.params.bookId);
        }
    }   
}) 

router.post('/admin/delete-book/:bookId', (req, res, next) => { 
    
    bookModel.findOne({ 
        where:{ 
            id:{ 
                [Op.eq] : req.body.book_id
            }
        }
    }).then((data) => { 
        if (data) {  
            
            bookModel.destroy({ 
                where: { 
                    id:{ 
                        [Op.eq] : req.body.book_id
                    }
                }
            }).then((status) => { 
                if (status) { 
                    req.flash("success", "Deleted Book successfully") 
                    res.redirect('/admin/list-book') 
                } else { 
                    // Delete operation failed 
                    req.flash("error", "Failed to delete book") 
                    res.redirect('/admin/list-book')
                }
            })

        } else { 
            // Book with the corresponding Id does not exist 
            req.flash("error", "Book not found") 
            res.redirect('/admin/list-book')
        }
    })

})

module.exports = router