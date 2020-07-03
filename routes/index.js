const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')  // ../ = 1st navigating up one level 

const Story = require('../models/Story')

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
router.get('/dashboard', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        //send text to client
        res.render('dashboard.hbs', {
            name: req.user.firstName,
            stories
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
    
})

module.exports = router