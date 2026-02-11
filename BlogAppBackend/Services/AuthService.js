import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserTypeModel } from "../models/UserModel.js"

export const register = async(userObj) => {
    // create a document
    const user = new UserTypeModel(userObj);
    // validate the password if there is "" empty password
    await user.validate();
    // hash and replacer plan password
    user.password = await bcrypt.hash(user.password,10);
    // save
    await user.save();
    // convert document to object to remove password
    const userNewObj = user.toObject();
    // remove password
    delete userNewObj.password;
    //return user obj without password
    return userNewObj;
}

export const authenticate = async({email,password}) => {
    const user = await UserTypeModel.findOne({email});
    if(!user){
        const err = new Error("Invalid User");
        err.status = 401;
        throw err;
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
        const err = new Error("Invalid Password");
        err.status = 401;
        throw err;
    }
    // check if user is blocked or not
    const isActive = user.isActive;
    if(!isActive){
        const err = new Error("User Blocked Plz Contact Admin");
        err.status = 401;
        throw err;
    }
    // genertae the token
    const token = jwt.sign({userId : user._id,role: user.role,email : user.email},process.env.JWT_TOKEN,{expiresIn :'1h'})

    const safe = user.toObject();
    console.log(safe)
    delete safe.password
    console.log(safe)
    return {token,safe}
}