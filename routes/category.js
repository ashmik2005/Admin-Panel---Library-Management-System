const express = require('express') 

const router = express.Router() 

router.get('/admin/add-category', (req, res) => { 
    res.render('admin/add-category')
}) 

router.get('/admin/list-category', (req, res) => { 
    res.render('admin/list-category')
})

module.exports = router 


