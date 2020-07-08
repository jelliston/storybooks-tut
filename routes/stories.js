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
       res.render('error/500.hbs')
   } 
})

//@desc         Show all stories (fetch and render)
//@route        GET /stories  
// since we have /stories in app.js where we link all of our routes 
router.get('/', ensureAuth, async (req, res) => {    //needs to be async since we're dealing with mongoose (with the db)
    try {
        //fetch all public stories and populate with the user model
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()                                         // add lean so we can pass into template

    res.render('stories/index.hbs', { 
        stories, 
    })

    } catch (err) {
        console.error(err)
        res.render('error/500.hbs')
    }
})

//@desc         Show edit page
//@route        GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    // find one story whose id matches the id of the currently logged in user
    const story = await Story.findOne({
        _id: req.params.id
    }).lean()
    
    //check to see if the story is there
    if (!story) {
        return res.render('error/404.hbs')
    }

    // we don't want users to be able to edit stories that aren't theirs
    if (story.user != req.user.id) {
        res.redirect('/stories')
    } else {
        res.render('stories/edit.hbs', {
            story,
        })
    }
})

//@desc         Update story
//@route        PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
    //check to see if the story is there (req.params.id gets the id from the url)
    let story = await Story.findById(req.params.id).lean()
    
    // if there is no story
    if (!story) {
       return res.render('error/404.hbs')
    }

    // if the story isn't the logged in users, then redirect
    if (story.user != req.user.id) {
        res.redirect('/stories')
    // if it IS their story, then update the story (using mongoose method)
    } else {
        //update the story id, with the content from req.body
        //as third arg add mongoose options 
        story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
            //will create new if blank/not there
            new: true,
            //will run mongoose validators
            runValidators: true,
        })

        //redirect to dashboard when finished
        res.redirect('/dashboard')
    }
})

module.exports = router