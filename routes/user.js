const express = require('express')  

const router = express.Router() 

router.get('/admin/add-user', (req, res) => { 
    res.render('admin/add-user')
})   

router.get('/admin/list-user', (req, res) => { 
    res.render('admin/list-user')
})

module.exports = router