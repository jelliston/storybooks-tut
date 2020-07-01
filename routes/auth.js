const express = require('express')
const passport = require('passport')
const router = express.Router()

//@description  Auth with Google 
//@route        GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

//@description  Google Auth Callback
//@route        GET /auth/google/callback
router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
    // successful authentication, redirect to dashboard
    res.redirect('/dashboard')
    }
)

//@desc     Logout user
//@route    /auth/logout
router.get('logout', (req, res) => {
    // the passport middleware has a logout object
    req.logout()
    res.redirect('/')
})

module.exports = router