const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')  // ../ = 1st navigating up one level 

//@description  Login/landing page
//@route        GET /
router.get('/', ensureGuest, (req, res) => {
    //send text to client
    res.render('login.hbs', {
        layout: 'login'
    })
})

//@description  Dashboard
//@route        GET /dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    //send text to client
    res.render('dashboard.hbs', {
        name: req.user.firstName
    })
})

module.exports = router