const express = require('express') 

const router = express.Router() 

router.get('/admin/currency-settings', (req, res) => { 
    res.render('admin/currency-settings')
}) 

router.get('/admin/days-settings', (req, res) => { 
    res.render('admin/day-settings')
})  

module.exports = router 


