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

//@desc     Auth with Microsoft
//@route    GET /auth/microsoft
router.get('/microsoft',
  passport.authenticate('microsoft', { scope: ['User.Read'] }),
  function (req, res) {
    // The request will be redirected to Microsoft for authentication, so this
    // function will not be called.
  });

//@description  Microsoft Auth Callback
//@route        GET /auth/microsoft/callback
router.get(
    '/microsoft/callback', 
    passport.authenticate('microsoft', { failureRedirect: '/' }),
    (req, res) => {
    // successful authentication, redirect to dashboard
    res.redirect('/dashboard')
    }
)

//@desc     Logout user
//@route    /auth/logout
// the passport middleware has a logout method on the request object - this is copy-paste from website
router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})

module.exports = router