const express = require('express')  
const Sequelize = require('sequelize')

// load model 
var categoryModel = require('../models').Category; 
var Op = Sequelize.Op;

const router = express.Router() 

router.route('/admin/add-category').get((req, res, next) => { 
    res.render('admin/add-category', { 
        title: "Add Category | LMS"
    })
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

router.route('/admin/edit-category/:categoryId').get((req, res, next) => {  

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
 
}).post((req, res, next) => { 
    categoryModel.findOne({ 
        where:{ 
            [Op.and] : [ 
                { 
                    id: { 
                        [Op.ne] : req.params.categoryId
                    } 
                }, 
                { 
                    name: { 
                        [Op.eq] : req.body.name 
                    }
                }
            ]
        }
    }).then((data) => { 
        if (data) { 
            // Category already exists 
            req.flash("error", "Category Already Exists") 
            res.redirect('/admin/edit-category/' + req.params.categoryId)
        } else { 
            // Category does not exist 
            categoryModel.update({ 
                name: req.body.name, 
                status: req.body.status
            }, { 
                where: { 
                    id: req.params.categoryId
                }
            }).then((data) => { 

                if(data) { 
                    req.flash("success", "Category has been updated")
                } else { 
                    req.flash("error", "Could not update category")
                } 
                
                res.redirect('/admin/edit-category/' + req.params.categoryId)
            })
        }
    })
}) 

router.post("/admin/delete-category", (req, res, next) => { 

    categoryModel.findOne({ 
        where: { 
            id: { 
                [Op.eq] : req.body.category_id
            }
        }
    }).then((data) => { 
        if (data) { 
            // Data found! Now we delete it 
            categoryModel.destroy({ 
                where: { 
                    id: { 
                        [Op.eq] : req.body.category_id
                    }
                }
            }).then((status) => { 
                if (status) { 
                    // Data deleted successfully  
                    req.flash("success", "Category deleted Successfully")

                } else { 
                    // Data could not be deleted 
                    req.flash("error", "Failed to delete category")
                } 

                res.redirect("/admin/list-category")
            })
        } else { 

        }
    })

})

module.exports = router 


