import {Schema,model} from 'mongoose'

// const cartSchema = new Schema({
//     product : {
//         type : Schema.Types.ObjectId,
//         ref : 'product',
//     },
//     quantity : {
//         type : Number,
//         ref : 'product'
//     }
// });
const cartSchema = new Schema({
    product : {
        type : Schema.Types.ObjectId,
        ref : 'product'
    },
    quantity : {
        type : Number,
        default : 1
    }
});
const userSchema = new Schema({
    name :{
        type : String,
        required : [true,"name is required"]
    },
    email : {
        type : String,
        required : [true,"Email is required"],
        unique : true
    },
    password : {
        type : String,
        required : [true,"password is required"]
    },
    cart : {
        type : [cartSchema]
    }
},{
    strict : "throw",
    timestamps : true
})

export const UserModel = model('users',userSchema)