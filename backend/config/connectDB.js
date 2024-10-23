const mongoose = require('mongoose')

async function connectDB(){    
    try {
        await mongoose.connect(process.env.MONGODB_URL,  { autoIndex: true})

        const connection = mongoose.connection

        connection.on('connected', ()=>{
            console.log('Connection to DB');            
        })

        connection.on('error', (error)=> {
            console.log('DB connection error', error);            
        })


    } catch (error) {
        console.log('Somsing is wrong ', error);        
    }
}

module.exports = connectDB