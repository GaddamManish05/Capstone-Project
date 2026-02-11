import jwt from 'jsonwebtoken'
export function verifyToken(req,res,next){
    // token verification logic

    // 1.Get token from req(using cookie-parser)
    let signedToken = req.cookies.token;
    if(!signedToken){
        return res.status(401).json({message : "Please Login First"})
    }
    // 2.verify the token
    let decodeToken = jwt.verify(signedToken,'secret');
    next();
}