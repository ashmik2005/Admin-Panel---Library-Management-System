const express = require('express')    
const bcrypt = require('bcrypt') 

const Sequelize = require("sequelize");

// Import models 
const adminModel = require('../models').Admin 

const { redirectHome, redirectLogin } = require('../middleware/redirect')

var Op = Sequelize.Op;



const router = express.Router() 

router.route("/admin/login").get(redirectHome,function(req, res, next){

    res.render("login");
}).post((req, res, next) => { 
    adminModel.findOne({ 
        where:{ 
            email:{ 
                [Op.eq] : req.body.email
            }
        }
    }).then((data) => { 
        if (data) {  

            bcrypt.compare(req.body.password, data.password, (error, result) => { 
                if (result) {  

                    req.session.isLoggedIn = true 
                    req.session.userId = data.id 
                    console.log(req.session)
                    res.redirect('/admin')

                } else { 
                    // Incorrect password 
                    req.flash("error", "Invalid credentials") 
                    res.redirect('/admin/login')
                }
            })

        } else { 
            req.flash("error", "Admin Credentials not registered") 
            res.redirect('/admin/login')
        }
    })
}) 

router.get("/admin/register", (req, res, next) => { 
    adminModel.create({ 
        name : "Ashmik", 
        email : "ashmik.h@gmail.com", 
        password : bcrypt.hashSync("ashmik1234", 10)
    }).then((data) => { 
        if (data) { 
            res.json({ 
                status:1, 
                message: "Admin created successfully"
            })
        } else { 
            res.json({ 
                status:0, 
                message: "Failed to create Admin"
            })
        }
    })
}) 

router.get('/admin/logout', (req, res, next) => { 
    req.session.destroy((error) => { 
        if (error) { 
            res.redirect('/admin')
        } 

        res.redirect('/admin/login')
    })
})


module.exports = router