const express = require('express')  

const router = express.Router() 

router.get('/admin/issue-book', (req, res) => { 
    res.render('admin/issue-a-book')
})    

router.get('/admin/list-issue-book', (req, res) => { 
    res.render('admin/issue-history')
})

module.exports = router