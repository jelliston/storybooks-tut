const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')
const connectDB = require('./config/db')

//Load config file where all global variables will live
dotenv.config({ path: './config/config.env' })

//Passport config
require('./config/passport')(passport)

//Call db connection
connectDB()

//initialize app with express
const app = express() 

//Make sure logger only runs in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Handlebars set up; also use .hbs file ext instead of .handlebars for convenience
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Express-session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,              // means we don't want to save a session if nothing modified
    saveUninitialized: false    // false means don't create a session until something stored
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

const PORT = process.env.PORT || 3000

app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)