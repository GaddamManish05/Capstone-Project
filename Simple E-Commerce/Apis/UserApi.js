import exp from 'express'
import {UserModel} from '../model/usermodel.js'
import { ProductModel } from '../model/productmodel.js';
import {hash} from 'bcryptjs'
export const userApp = exp.Router()

//  Add "quantity" filed  along with productId in user cart. Set the initial value of "quantity"
//  field is 1 by default. When user adding a product to cart, it should check that product is already there in cart.
//  If it is there , increment count by 1. If product is not there, then add new product to cart with quantity as 1
// route to get all user details
userApp.get('/users',async(req,res)=>{
    // get all users from db
    let userList = await UserModel.find();
    // send the response
    res.status(200).json({message : "Users are",users : userList});
})
// get specific user details
userApp.get('/user/:uid',async(req,res) => {
    // extract user details from parameter
    let {uid} = req.params
    // find the user in db
    let userDoc = await UserModel.findById(uid).populate("cart.product","productname price");
    // check the user is exist or not
    if(!userDoc){
        return res.status(401).json({message : "user not found"});
    }
    // send response 
    res.status(200).json({message : "User",payload : userDoc})
})
// create a user
userApp.post('/users',async(req,res)=> {
    // Extract user for request body
    let userDoc = req.body;
    // check if user already exist or not 
    let userStatus = await UserModel.findOne({email : userDoc.email});
    if(userStatus){
        return res.json({message : "User already exists"});
    }
    // check the schema of user collection
    let newUserDoc = new UserModel(userDoc);
    // hash the password
    let hashedPassword = await hash(userDoc.password,12);
    // replace with hashed password 
    userDoc.password = hashedPassword;
    // save and check the validation rules 
    await newUserDoc.save();
    // delete password from js object not in db
    delete userDoc.password
    // send the response 
    res.status(200).json({message : "User Created",payload : userDoc})
})

userApp.put('/user/:id',async(req,res)=> {
    // extract id from req body
    let userId = req.params.id
    //userId should present in your data base
    let updateUser = await UserModel.findByIdAndUpdate(userId,req.body,{new : true,runValidators : true})
    // if present update the value
    if(!updateUser){
        return res.status(404).json({message : "User not found"})
    }
    //send response 
    return res.status(200).json({message : "User Modifyed"});
})
userApp.put('/user-cart/user-id/:uid/product-id/:pid',async(req,res) => {
    let {uid,pid} = req.params
    let userDoc = await UserModel.findById(uid);
    if(!userDoc){
        return res.status(401).json({message : "User Not found"});
    }
    let productDoc = await ProductModel.findById(pid);
    if(!productDoc){
        return res.status(401).json({message : "Product Not found int Cart"});
    }
    let checkUser = userDoc.cart.find(item => item.product.toString() === pid)
    if(checkUser){
        await UserModel.updateOne({_id : uid , "cart.product" : pid},{$inc : {"cart.$.quantity" : 1}});
    }else{
        await UserModel.updateOne({_id : uid},{$push: {cart : {product : pid,quantity : 1}}});

    }
    res.status(200).json({message :"Add tot cart",payload : userDoc});
})
userApp.delete('/user-cart/user-id/:uid/product-id/:pid',async(req,res)=> {
    // extract uid and pid
    let { uid , pid } = req.params;
    // check the uid and pid exists
    let userDoc = await UserModel.findById(uid);
    if(!userDoc){
        return res.status(401).json({message : "User Not found"});
    }
    let productDoc = await ProductModel.findById(pid);
    if(!productDoc){
        return res.status(401).json({message : "Product Not found int Cart"});
    }
    // check pid is present in uid or not
    let productStatus = userDoc.cart.find(item => item.product.toString() === pid);
    // modify / delete the pid from the user 
    if(!productStatus){
        return res.status(401).json({message :"product not found in user cart"});
    }
    if(productStatus.quantity > 1){
        await UserModel.updateOne({_id:uid,"cart.product" : pid},{$inc : {"cart.$.quantity" : -1}});
    }else{
        await UserModel.updateOne({_id : uid},{$pull : {cart : {product : pid}}});
    }
    // send the response
    res.status(200).json({message : "Product removed" , payload : userDoc , removedProduct : productDoc});

})


