import exp from 'express'
import {connect} from 'mongoose'
import { config } from 'dotenv'
import  cookieParser from 'cookie-parser'
import {userApp} from './Apis/UserApi.js'
import {adminApp} from './Apis/AdminApi.js'
import {authorApp} from './Apis/AuthorApi.js'
import { commonApp } from './Apis/Common-api.js'

config()

const app = exp()
app.use(exp.json())
app.use(cookieParser())
//connect api's
app.use('/user-api',userApp);
app.use('/author-api',authorApp);
app.use('/admin-api',adminApp);
app.use('/common-api',commonApp)

const connectDB = async() => {
    try{
        await connect(process.env.DB_URL);
        console.log("DB Connection done");
        app.listen(process.env.PORT,() => {
            console.log("Server started");
        })
    }catch(err){
        console.log("Connection Failed",err)
    }
}
connectDB()
app.post('/logout',(req,res) => {
    res.clearCookie('token',{
        httpOnly : true,
        secure : false,
        sameSite : "lax"
    });
    res.status(200).json({message : "Logout Successful"})
})
app.use((req,res,next) => {
    res.json({message : `${req.url} is Invalid Path`})
})


app.use((err,req,res,next) => {
    res.json({message : "Error Found",reason : err.message});
})