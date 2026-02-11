import {Schema,model} from 'mongoose'
// create user schema
//create user model  with that schema 

const cartSchema = new Schema({
    productId : {
        type : Schema.Types.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    }
})

const userSchema = new Schema({
    username:{
        type : String,
        required : [true,"User Name is Required"],
        minLenght : [4, "Minimum Length Must be 4"],
        maxLength : [6, "Maximum Length Exceeded" ]
    },
    password : {
        type : String,
        required : [true, "Password is Required"]
    },
    age : {
        type : Number,
        required : [true,"Age is Required"],
        min : [18, "Age Should be Above 18"],
        max : [25, "Age IS Exceeded"]
    },
    cart : [cartSchema]
},{
    strict : "throw", // which is used to validate the schema 
    timestamps: true // which creates extra field of creating and updation type of field
})
// create and export the model
export const UserModel = model("user",userSchema); 