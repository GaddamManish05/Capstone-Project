import {Schema,model} from 'mongoose'

let productSchema = new Schema({
    pid:{
        type : Number,
        required :[true]
    },
    productname : {
        type : String,
        required : [true,"Product name is required"],
        minLength : [4,'Length of Name must be above 3'],
        maxLength : [8,"Length of name must be below 8"],
    },
    price :{
        type : Number,
        required : [true,"Price is required"],
        min : [10,'Price Must be above 10'],
        max : [2000, 'Price must be below 2000']
    }
},
{
    strict : "throw", // which is used to validate the schema
    timestamps: true // which creates extra field of creating and updation type of field
})

export const ProductModel = model('product',productSchema);