import exp from 'express'
import { connect } from 'mongoose'
import { userApp } from './Apis/UserApi.js'
import { productApp } from './Apis/ProductApi.js'
// Create main Express application (Main HTTP Server)
const app = exp();

// Async function to connect MongoDB first,
// then start server only if DB connection is successful
async function connection() {
    try {
        // Connect to MongoDB database named "ecommerce"
        await connect("mongodb://localhost:27017/ecommerce");

        // Start HTTP server only after DB connection success
        app.listen(3000, () => {
            console.log('HTTP server is listening on port 3000')
        })
    }
    catch (err) {
        // If database connection fails
        console.log('Connection Failed with Database')
    }
}

// Call the connection function
connection()
// Built-in middleware
// Converts incoming json request body into Js object
app.use(exp.json())

// Mount user related APIs
// All routes inside userApp will start with /user-api
// Example: /user-api/users
app.use('/user-api', userApp)

// Mount product related APIs
// Example: /product-api/products
app.use('/product-api', productApp)

// Error-handling middleware
// It catches errors from any route or middleware
app.use((err, req, res, next) => {
    res.status(500).json({
        message: 'Error Found',
        reason: err.message
    })
})
