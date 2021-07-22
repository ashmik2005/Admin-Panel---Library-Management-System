const express = require('express')  
const Sequelize = require('sequelize')

// load model 
var categoryModel = require('../models').Category; 
var Op = Sequelize.Op;

const router = express.Router() 

router.route('/admin/add-category').get((req, res, next) => { 
    res.render('admin/add-category')
}).post((req, res, next) => {  

    categoryModel.findOne({ 
        where:{ 
            name:{ 
                [Op.eq]: req.body.name
            }
        }
    }).then((data)=>{ 
        if (data) { 
            //duplicate value 
            req.flash("error", "Category already exists") 
            res.redirect('/admin/add-category')
        } else { 
            categoryModel.create({ 
                name: req.body.name, 
                status: req.body.status
            }).then((category) => {  
        
                if (category) {  
                    req.flash("success", "Category added successfully!")
                    res.redirect('/admin/add-category')
                } else { 
                    req.flash("error", "Something went wrong :(") 
                    res.redirect('/admin/add-category')
                }
            })
        }
    })

   
})

router.get('/admin/list-category', async (req, res, next) => {  

    var all_categories = await categoryModel.findAll(); 

    res.render('admin/list-category', { 
        categories: all_categories
    });
}) 

router.get('/admin/edit-category/:categoryId', (req, res, next) => {  

    categoryModel.findOne({ 
        where:{ 
            id:{ 
                [Op.eq] : req.params.categoryId 
            }
        }
    }).then((data) => { 
        res.render('admin/edit-category', { 
            category: data
        })
    })
 
})

module.exports = router 


