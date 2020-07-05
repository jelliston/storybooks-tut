const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
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

//Make sure logger only runs in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// handlebars helpers
const { formatDate } = require('./helpers/hbs')

// Handlebars set up; also use .hbs file ext instead of .handlebars for convenience
app.engine('.hbs', exphbs({ helpers: { formatDate }, defaultLayout: 'main', extname: '.hbs' }));
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