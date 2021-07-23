const express = require('express')   

const Sequelize = require('sequelize') 

var Op = Sequelize.Op 

// Load user model 
var userModel = require('../models').User

const router = express.Router() 

router.route('/admin/add-user').get((req, res, next) => { 
    res.render('admin/add-user')
}).post((req, res, next) => {  

    // Check if email already exists 

    userModel.findOne({ 
        where:{ 
            email:{ 
                [Op.eq] : req.body.email
            }
        }
    }).then((data) => { 
        if (data) { 
            // Found duplicate 
            req.flash("error", "Email is already in use") 
            res.redirect('/admin/add-user')
        } else{  
            userModel.create({ 
                name: req.body.name, 
                email: req.body.email, 
                mobile: req.body.mobile, 
                gender: req.body.dd_gender,  
                address: req.body.address,
                status: req.body.status
            }).then((status) => { 
                if (status) { 
                    // User successfully lodged into the database  
                    req.flash("success", "User Created Successfully") 
                    res.redirect('/admin/add-user')
        
                } else { 
                    req.flash("error", "Failed to create user") 
                    res.redirect('/admin/add-user')
                }
            })

        }
    })
})   

router.get('/admin/list-user', async (req, res, next) => {   

    var user_data = await userModel.findAll()

    res.render('admin/list-user', { 
        users: user_data
    })
}) 

router.route('/admin/edit-user/:userId').get(async (req, res, next) => {  

    var userdata = await userModel.findOne({ 
        where:{ 
            id:{ 
                [Op.eq] : req.params.userId
            }
        }
    })

    res.render('admin/edit-user', { 
        user: userdata
    })
}).post((req, res, next) => { 
    userModel.update({  
        name: req.body.name, 
        mobile: req.body.mobile, 
        gender: req.body.dd_gender,  
        address: req.body.address,
        status: req.body.status
    }, { 
        where:{ 
            id:{ 
                [Op.eq] : req.params.userId
            }
        }
    }).then((status) => { 
        if (status) { 
            req.flash("success", "User data updated successfully") 
        } else { 
            req.flash("error", "Failed to update user data") 
        } 

        res.redirect('/admin/edit-user/' + req.params)
    })
}) 

router.post('/admin/delete-user', (req, res, next) => { 
    userModel.destroy({ 
        where: { 
            id:{ 
                [Op.eq] : req.body.user_id
            }
        }
    }).then((status) => { 
        if (status) { 
            req.flash("success", "User deleted successfully")
        } else { 
            req.flash("error", "Failed to delete user")
        } 

        res.redirect('/admin/list-user')
    })
})

module.exports = router