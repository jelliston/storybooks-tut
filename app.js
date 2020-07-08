const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')

//Load config file where all global variables will live
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

//Call db connection
connectDB()

//initialize app with express
const app = express() 

//Body Parser middleware - it will accept urlencoded and json
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Method override for PUT and DELETE requests
app.use(
    methodOverride(function (req, res) {
        // it will check the request body and look for the method, 
        // replace it with whatever method we add (PUT or DELETE) and then delete the original method
        if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
        }
    })
)

//Make sure logger only runs in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// handlebars helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

// Handlebars set up; also use .hbs file ext instead of .handlebars for convenience
app.engine(
    '.hbs', 
    exphbs({ 
        helpers: { 
            formatDate, 
            truncate, 
            stripTags, 
            editIcon,
            select 
        }, 
        defaultLayout: 'main', 
        extname: '.hbs' 
    })
);
app.set('view engine', '.hbs');

// Express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,              // means we don't want to save a session if nothing modified
    saveUninitialized: false,    // false means don't create a session until something stored
    store: new MongoStore({ mongooseConnection: mongoose.connection })
    //cookie: { secure: true }    cookie won't work without https...
  }))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Set global variable 
// doing this should allow me to access the logged-in-user from our templates
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// Link routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)