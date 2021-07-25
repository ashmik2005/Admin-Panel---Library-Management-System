const express = require('express')  

const Sequelize = require("sequelize") 
var Op = Sequelize.Op 

// Import models 
var optionModel = require('../models').Option 
var daysModel = require('../models').DaySetting

const router = express.Router() 

router.route('/admin/currency-settings').get(async (req, res) => { 
    
    var currency_data = await optionModel.findOne({ 
        where:{ 
            option_name:{ 
                [Op.eq] : "active_currency" 
            }
        }
    })
    
    res.render('admin/currency-settings', { 
        currency_data:currency_data
    })
}).post((req, res, next) => { 
    // Matching the key  
    optionModel.findOne({ 
        where:{ 
            option_name:{ 
                [Op.eq] : "active_currency"
            }
        }
    }).then((data) => { 
        if (data) {  
            // Match found 
            optionModel.update({ 
                option_value : req.body.dd_currency
            }, { 
                where:{ 
                    option_name:{ 
                        [Op.eq] : "active_currency"
                    }
                }
            }).then((status) => { 
                if (status) { 
                    req.flash("success", "Currency Settings Updated")
                } else { 
                    req.flash("error", "Failed to update currency settings")
                } 
                res.redirect('/admin/currency-settings')
            })
        } else { 
            optionModel.create({ 
                option_name: "active_currency", 
                option_value: req.body.dd_currency
            }).then((status) => { 
                if (status) { 
                    req.flash("success", "Currency Settings Saved") 
                    
                } else { 
                    req.flash("error", "Failed to update currency settings")
                } 
                res.redirect('/admin/currency-settings')
            })
        }
    })

}) 

router.route("/admin/days-settings").get(async (req, res) => {  

    var days = await daysModel.findAll()
    res.render('admin/day-settings', { 
        days:days        
    })
}).post((req, res, next) => { 

    daysModel.findOne({ 
        where:{ 
            total_days:{ 
                [Op.eq] : req.body.day_count
            }
        }
    }).then((data) => { 
        if (data) { 
            // Day count already exists 
            req.flash("error", "Day count already in existence") 
            res.redirect('/admin/days-settings')
        } else { 
            daysModel.create({ 
                total_days : req.body.day_count
            }).then((status) => { 
                if (status) { 
                    req.flash("success", "Day count added successfully")
                } else { 
                    req.flash("error", "Could not add day count")
                } 
                res.redirect('/admin/days-settings')
            })
        }
    })

})   

router.post("/admin/delete-days/:dayID", function(req, res, next){

    daysModel.destroy({
        where:{
            id: {
                [Op.eq]: req.params.dayID
            }
        }
    }).then((data) => {
        if(data){
            //data has been deleted
            req.flash("success", "Data has been deleted");
        }else{
            // some error
            req.flash("error", "Failed to delete data");
        }
        res.redirect("/admin/days-settings");
    })
});

module.exports = router 


