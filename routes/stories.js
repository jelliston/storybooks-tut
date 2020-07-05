const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')  // ../ = 1st navigating up one level 

const Story = require('../models/Story')

//@desc         Show add page
//@route        GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    //send text to client
    res.render('stories/add.hbs')
})

//@desc         Process add form
//@route        POST /stories
router.post('/', ensureAuth, async (req, res) => {
   //create the story using express, but requires Body Parser middleware
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
   } catch (err) {
       console.error(err)
       res.render('error/500')
   } 
})

module.exports = router