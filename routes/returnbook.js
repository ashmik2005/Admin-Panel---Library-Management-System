const express = require('express')  

const router = express.Router() 

router.get('/admin/return-a-book', (req, res) => { 
    res.render('admin/return-a-book')
})     

router.get('/admin/return-list-book', (req, res) => { 
    res.render('admin/return-list')
})    



module.exports = router