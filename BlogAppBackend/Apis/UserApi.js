import exp from 'express'
import {authenticate, register} from '../Services/AuthService.js'
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middlewares/verifyToken.js';
import { ArticleModel } from '../models/ArticalModel.js';
import { checkAuthor } from '../middlewares/checkAuthor.js';

export const userApp = exp.Router();
// register user
userApp.post('/users',async(req,res) => {
    // get the user obj by req body 
    let userDoc = req.body;
    // pass the user obj to function
    const newUserObj = await register({...userDoc,role : "USER"});
    res.status(201).json({message : "User Created", payload : newUserObj})
})
// Read All Articles
userApp.get('/articles',verifyToken,async(req,res) => {
    // extract all the articles from article collection
    let articleDocs = await ArticleModel.find();
    // send response all aricle/s
    let articlesList = articleDocs.filter(article => article.isArticleActive === true)
    res.status(200).json({message : "Articles" , payload : articlesList});
})
// Add Comment to an article
userApp.put('/comments',verifyToken,async(req,res) => {
    // get article as from req parameter
    let {articleId} = req.body;
    // verify wheather article present or not
    let articleStatus = await ArticleModel.findOne({_id : articleId })
    console.log(articleStatus)
    if(!articleStatus){
        return res.status(400).json({message : "Article not found"});
    }
    // add comments to article if valid and update in db
    let addComment = await ArticleModel.findByIdAndUpdate(articleId,{$push : {comment : {user : articleId , comment : "Good Article"}}},{new : true});
    // send res
    res.status(200).json({message : "Comment Added to article"});
})