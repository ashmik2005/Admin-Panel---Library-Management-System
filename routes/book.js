const express = require('express')  

const router = express.Router() 

router.get('/admin/add-book', (req, res) => { 
    res.render('admin/add-book')
})  

router.get('/admin/list-book', (req, res) => { 
    res.render('admin/list-book')
})

module.exports = router