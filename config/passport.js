const GoogleStrategy = require('passport-google-oauth20').Strategy
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function (passport) {
    passport.use(
        new GoogleStrategy(
            {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback'
            },
            async (accessToken, refreshToken, profile, done) => {
                //these must align with the user schema we created and with the data google gives us
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value
                }

                try {
                   //look for the user, using mongoose, find a user where googleId = to profile.id
                    let user = await User.findOne({ googleId: profile.id })

                    //if user like this exists, call callback
                    if (user) {
                        done(null, user)
                    //if there is no user like this, then create one and call callback
                    } else { 
                        user = await User.create(newUser)
                        done(null, user)
                    }
                } catch (err) {
                    console.error(err)    
                }
            }
        )
   ),

   passport.use(
       new OIDCStrategy(
        {
        identityMetadata: `${process.env.AZURE_AUTHORITY}${process.env.AZURE_OAUTH_ID_METADATA}`,
        clientID: process.env.AZURE_CLIENT_ID,
        responseType: 'code id_token',
        responseMode: 'form_post',
        redirectUrl: process.env.AZURE_REDIRECT_URI,
        allowHttpForRedirectUrl: true,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        validateIssuer: false,
        passReqToCallback: false,
        scope: process.env.AZURE_SCOPES.split(' ')
        },
        signInComplete  // need to add this in from passport website next
        )
    ),

    //comes from passport documentation (serialize and deserialize users) - changed to arrow functions
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })
}