import exp from "express"
import {userApp} from './UserApi.js'
import {productApp} from './ProductApi.js'
import {connect} from 'mongoose'
import cookieParser from "cookie-parser"

const app = exp();

const port = 4000;
// converts to json to js object
app.use(exp.json())
// db connectivity
async function connection(){
    try{
    await connect('mongodb://localhost:27017/anuragdb2') // database connectivity 
    app.listen(4000,() => { // creates HTTP server 
        console.log("HTTP Server Is listened on port 4000"); 
    })
    }catch(err){ // if any error occurs
        console.log('Error in connection',err)
    }
}

connection() // connectivity calling function
app.use(cookieParser()) // which is used call verify Token function call

app.use('/user-api',userApp) // used for user routes
app.use('/product-api',productApp) // used for product routes

app.use((err,req,res,next) => { // middleware to transfer error message in json format
    res.status(500).json({message : 'Error Found',reasons: err.message})
})
