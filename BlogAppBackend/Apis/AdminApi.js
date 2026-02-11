import exp from 'express';
import {UserTypeModel} from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifyToken.js';

export const adminApp = exp.Router();

// read all the articles (optional)
// Block 
adminApp.put('/block',verifyToken, async(req,res) => {
    // extract the user details like id
    let {authorId} = req.body
    // if user present block the user by updating it to isActive is to false
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(authorId,{$set :{isActive : false}},{new : true})
    if(!modifiedUser){
        return res.status(401).json({message : "User Not found"})
    }
    // send the response as blocked
    res.status(200).json({message : "User Blocked" , user : modifiedUser});
})


// unblock user roles
adminApp.put('/unblock',verifyToken,async(req,res) => {
    // extract the user cred id
    let {authorId} = req.body
    // find the id in db and modify it into unvlock
    let modifiedUser = await UserTypeModel.findByIdAndUpdate(authorId,{$set : {isActive : true}},{new : true})
    if(!modifiedUser){
        return res.status(401).json({message : "User Not found"})
    }
   // send the response 
    res.status(200).json({message : "User Unblocked" , user : modifiedUser});
})