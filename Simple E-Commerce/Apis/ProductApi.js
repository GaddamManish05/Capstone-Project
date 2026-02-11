import exp from 'express'
import {ProductModel} from '../model/productmodel.js'

export const productApp = exp.Router();
// get all the products
productApp.get('/products',async(req,res) => {
    // Extract all the details of product 
    let productList = await ProductModel.find();
    // send the response 
    res.status(200).json({message : "Product List", Products : productList})
})
// create a product 
productApp.post('/products',async(req,res) => {
    // extract the details from re.body
    let productDoc = req.body;
    // validate the doc
    let newProductDoc = new ProductModel(productDoc);
    // save it in db
    await newProductDoc.save();
    // send the response
    res.status(200).json({message : "Product Created"})
})
// update the product details
productApp.put('/product/:pid',async(req,res)=>{
    // extract pid from req.params
    let {pid} = req.params
    // extract the details from req.body
    let {productname,price,brand} = req.body;
    // get the doc from db
    let productStatus = await ProductModel.findById(pid);
    // cehck if is present or not 
    if(!productStatus){
        return res.status(404).json({message : "Prodcut not found"});
    }
    // modify the content od product in db
    let modifiedDoc = await ProductModel.findByIdAndUpdate(pid,{$set : req.body},{new  : true})
    // send the response
    res.status(200).json({message : "Prodcut Updated"});
})
// delete the product details
productApp.delete('/product/:pid', async (req, res) => {
    // extract the pid 
    let { pid } = req.params;
    // find it in db and update
    let deletedProduct = await ProductModel.findByIdAndDelete(pid);
    // check if it present or not
    if (!deletedProduct) {
        return res.status(404).json({message: "Product Not Found"});
    }
    // send response 
    res.status(200).json({message: "Product Deleted",payload: deletedProduct});
});
