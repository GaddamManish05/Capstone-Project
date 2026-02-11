import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config()
export const verifyToken = (req,res,next) => {
    let token = req.cookies?.token
    // check if the token it present or not
    if(token === undefined){
        return res.status(400).json({message : "Unauthorized"})
    }
    // verify the token
    let decodedToken = jwt.verify(token,process.env.JWT_TOKEN);
    // forwardes to next middleware / route
    console.log(decodedToken)
    req.user = decodedToken
    next();
}