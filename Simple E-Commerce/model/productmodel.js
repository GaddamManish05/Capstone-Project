import { Schema,model } from "mongoose";

const productSchema = new Schema({
    productname : {
        type : String,
        required : [true,"name is required"]
    },
    price : {
        type : Number,
        required : [true,"price is required"]
    },
    brand : {
        type : String,
        required : [true,"brand is required"]
    }
},{
    strict : "throw",
    timestamps :true
})

export const ProductModel = model('product',productSchema);

