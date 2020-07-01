const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        //try to connect so create connection var which returns a promise 
        //(passing in connection string) { add in options to avoid warnings in console} 
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

//export to allow running by app.js file
module.exports = connectDB