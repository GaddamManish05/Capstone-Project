// import express framework
import exp from "express"
// import User mongoose model
import { UserModel } from "./models/UserModel.js"; 
// import bcrypt functions for password hashing and comparison
import { hash, compare } from "bcryptjs";
import jwt from 'jsonwebtoken'
import { verifyToken } from './middleware/verifytoken.js'
// create a router instance for user-related routes
export const userApp = exp.Router();

//GET request to fetch all users
userApp.get('/users', async (req, res) => {
    // get all user documents from database
    let userList = await UserModel.find()
    // send users list as response
    res.status(200).json({ message: "users", payload: userList })
})

// GET request to fetch a single user by ID
userApp.get('/user/:id', async (req, res) => {
    // get user id from request params
    let objId = req.params.id
    // Find user by ID in database
    let userObj = await UserModel.findById(objId);
    // If user not found,
    if (!userObj) {
        return res.status(404).json({ message: 'User Not Found' });
    } 
    // If user found, return success response
    return res.status(200).json({ message: 'User Found', user: objId });
})
// POST request to create a new user
userApp.post('/users', async (req, res) => {
    // Get new user data from request body
    let newUser = req.body;
    // hash the user password
    let hashedPassword = await hash(newUser.password, 12)
    // replace plain password with hashed password
    newUser.password = hashedPassword
    // Create a new User document
    let newUserDoc = new UserModel(newUser);
    // save user document into database
    await newUserDoc.save();
    // send success response
    res.status(200).json({ message: 'User Created' })
})

// POST request for user login
userApp.post('/auth', async (req, res) => {
    let userCred = req.body
    // find user by username
    let userFind = await UserModel.findOne({ username: userCred.username });
    // if user not found, return error message
    if (userFind === null) {
        return res.status(404).json({ message: "User not found" });
    }
    // compare entered password with stored hashed password
    let status = await compare(userCred.password, userFind.password)
    // if password does not match, return error
    if (status === false) {
        return res.status(404).json({ message: "Password not matched" });
    }
    // generate token with username as payload
    let signedToken = jwt.sign(
        { username: userCred.username },
        'secret',
        { expiresIn: 30 }
    )
    // store token in HTTP-only cookie
    res.cookie('token', signedToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    // Send login success response
    res.status(200).json({ message: "Login successful" })
})

// PUT request to update user details
userApp.put('/user/:id', async (req, res) => {
    //user ID from request params
    let objId = req.params.id
    //updated data from request body
    let modifyId = req.body
    // update user document and return updated user
    let latestUser = await UserModel.findByIdAndUpdate(
        objId,
        { $set: { ...modifyId } },
        { new: true }
    )
    // send updated user as response
    res.status(200).json({ message: 'User modifyed', user: latestUser })
})


// DELETE request to remove a user
userApp.delete('/user/:id', async (req, res) => {
    // user ID from request params
    let objId = req.params.id;
    // delete user document from database
    let removedDoc = await UserModel.findByIdAndDelete(objId)
    // send success response
    res.status(200).json({ message: 'User Removed', user: objId })
})


// GET request for protected route
userApp.get('/test', verifyToken, async (req, res) => {
    // send response if token is valid
    res.json({ message: "Route Found" })
})
