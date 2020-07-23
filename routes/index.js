const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')  // ../ = 1st navigating up one level 

const Story = require('../models/Story')
const Contact = require('../models/Contact')

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

//@description  About page
//@route        GET /about
router.get('/about', ensureAuth, (req, res) => {
    //send text to client
    res.render('about.hbs', {
        layout: 'about'
    })
})

//@desc         Process contact form
//@route        POST /about
router.post('/about', ensureAuth, async (req, res) => {
    //create the contact using express, but requires Body Parser middleware
     try {
         req.body.user = req.user.id
         await Contact.create(req.body)
         console.log(req.body)
         res.redirect('/about')
    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    } 
 })

 //@description  Admin
//@route        GET /admin
router.get('/admin', ensureAuth, async (req, res) => {
    try {
        const contacts = await Contact.find()
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()
        //send text to client
        res.render('admin.hbs', {
            contacts
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
    
})

module.exports = router