const express = require('express')
const router = express.Router()

//@description  Login/landing page
//@route        GET /
router.get('/', (req, res) => {
    //send text to client
    res.render('login.hbs', {
        layout: 'login'
    })
})

//@description  Dashboard
//@route        GET /dashboard
router.get('/dashboard', (req, res) => {
    //send text to client
    res.render('dashboard.hbs')
})

module.exports = router