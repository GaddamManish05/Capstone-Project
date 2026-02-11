import exp from 'express'
import {register,authenticate} from '../Services/AuthService.js'
import { UserTypeModel } from '../models/UserModel.js';
import { ArticleModel } from '../models/ArticalModel.js';
import {checkAuthor} from '../middlewares/checkAuthor.js'
import { verifyToken } from '../middlewares/verifyToken.js';
export const authorApp = exp.Router();

// regsiter author
authorApp.post('/users',async(req,res) => {
    const userDoc = req.body
    const newUserObj = await register({...userDoc,role : "AUTHOR"});
    res.status(201).json({message : "Author Created",payload : newUserObj});
})
// authenticate the author
// create an article
authorApp.post('/articles' ,verifyToken,async(req,res) => {
    // get the article
    const article = req.body
    // check the author 
    let authorStatus = await UserTypeModel.findById(article.author);
    if(!authorStatus && authorRole !== "AUTHOR"){
        return res.status(401).json({message : "Author not found"});
    }
    // create article document
    let articleDoc = new ArticleModel(article);
    // save the article
    await articleDoc.save()
    // send res
    res.status(200).json({message : "Article created",payload : articleDoc});
})

authorApp.get('/articles/:authorId',verifyToken,checkAuthor,async(req,res) => {
    let authorId = req.params.authorId;
    //check the author
    // get  all articles of author id 
    let articleList = await ArticleModel.find({author :authorId,isArticleActive : true}).populate("author","firstName email");
    console.log(articleList);
    res.status(200).json({message : "author Articles",payload : articleList})
})
// edit an article
authorApp.put('/articles',verifyToken,checkAuthor,async(req,res) =>{
    // get modified articl
    let {author,articleId,title,category,content} = req.body;
    let authorId = req.user.userId;
    console.log(authorId)
    // find the article
    let articleStatus = await ArticleModel.findOne({_id: articleId,author:authorId });
    // check if article is published by the author recieved from the client 
    if(!articleStatus){
        return res.status(401).json({message : "Article Not found"});
    }
    // update the article
    let modifyedDoc = await ArticleModel.findByIdAndUpdate(articleId,{$set :{title,category,content}},{new : true});
    //send (updated article)
    res.status(200).json({message : "modified" , payload : modifyedDoc});
})
// delete an article
authorApp.put('/articles-delete',verifyToken,async(req,res) => {
    let {articleId,authorId} = req.body;
    let articleDoc = await ArticleModel.findOne({_id : articleId , author : authorId});
    if(!articleDoc){
        res.status(401).json({message : "Article Not found"});
    }
    let modifiedDoc = await ArticleModel.findByIdAndUpdate(articleId,{$set : {isArticleActive : false}},{new : true})
    res.status(200).json({message : "Article Deleted" , payload : modifiedDoc});
})

// read all articles



