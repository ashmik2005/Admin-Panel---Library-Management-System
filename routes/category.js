const express = require('express') 

const router = express.Router() 

router.get('/admin/add-category', (req, res) => { 
    res.render('admin/add-category')
})

module.exports = router