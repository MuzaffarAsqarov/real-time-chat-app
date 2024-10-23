const express = require('express')
const cors =require('cors')
const connectDB = require('./config/connectDB')
require('dotenv').config()
const router = require('./routes/router')
const path = require('path')
const cookiesParser = require('cookie-parser') 
const { app, server } = require('./socket/socket')

// const app = express()


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookiesParser())
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 8080



app.get('/', (req, res) => {
    res.json({
        message: "Server running at "+ PORT
    })   
})

app.use('/api', router)





connectDB().then(()=> {
    server.listen(PORT, () => {
        console.log("Server running is at Port " + PORT);    
    })
})