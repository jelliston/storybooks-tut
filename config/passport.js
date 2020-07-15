const GoogleStrategy = require('passport-google-oauth20').Strategy
const MicrosoftStrategy = require('passport-microsoft').Strategy
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
    new MicrosoftStrategy(
        {
        clientID: process.env.AZURE_CLIENT_ID,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/microsoft/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            //these must align with the user schema we created and with the data google gives us
            const newUser = {
                googleId: profile.id,
                displayName: profile.displayName,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName
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
    
   )

    //comes from passport documentation (serialize and deserialize users) - changed to arrow functions
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
      passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })
}