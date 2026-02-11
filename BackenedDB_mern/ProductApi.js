// Import express framework
import exp from 'express'
// Import Product mongoose model
import { ProductModel } from './models/ProductModel.js'
// mini HTTP server for product apis
export let productApp = exp.Router(); // Creates a mini HTTP server (Router)
// route to fetch all products
productApp.get('/products', async (req, res) => { 
    // find all product documents
    let productList = await ProductModel.find(); 
    // send products as json response
    res.status(200).json({ message: 'Product Found', products: productList }) 
})

// route to add a new product
productApp.post('/products', async (req, res) => {
    // collect request body data (json => js object)
    let newProduct = req.body 
    // create a new Product document using client data
    let newProductDoc = new ProductModel(newProduct) 
    // save the product document into database
    await newProductDoc.save(); 
    // send success response
    res.status(200).json({ message: 'Product Created' }) 
})
// route to find a single product by id
productApp.get('/product/:id', async (req, res) => {
    // product id from url params
    let prodId = req.params.id
    // find product document by id
    let findProdDoc = await ProductModel.findById(prodId)
    // if product not found, return error
    if (!findProdDoc) {
        return res.status(404).json({ message: 'Product Not Found' })
    }
    // if product found, return success response
    return res.status(200).json({ message: 'Product Found', product: prodId })
})

// Route to update product details by id
productApp.put('/product/:id', async (req, res) => {
    // product ID from URL params
    let prodId = req.params.id
    // collect updated data from request body
    let modifyProd = req.body
    // update product document and apply validators
    let modifyedDoc = await ProductModel.findByIdAndUpdate(
        prodId,
        { $set: { ...modifyProd } },
        { new: true, runValidators: true }
    )
    
    // send success response
    res.status(200).json({ message: 'Product Modifyed' })
})

// route to delete a product by ID
productApp.delete('/product/:id', async (req, res) => {
    // product ID from url params
    let prodId = req.params.id;
    // delete product document from database
    let removeProdDoc = await ProductModel.findByIdAndDelete(prodId)
    // send success response
    res.status(200).json({ message: 'Product Removed' })
})
