import User from '../models/User'
// jwt token there or not middleware
// i will send the jwt token in the request cookies and this middleware will identify whether jwt is compromised or not
const expressJwt= require('express-jwt');

export const jwtSigned= expressJwt({
    getToken: (req, res)=> req.cookies.token,
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

export const isInstructor= async(req, res, next)=>{
    // req.user._id from jwt middleware 
    const user= await User.findById(req.user.userid).exec();
    if(user && user.role.includes('Instructor')) next();  // call the next function 
    else return res.status(403).json("You are not allowed to make this request");
}