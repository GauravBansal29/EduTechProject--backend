import {createRequire} from "module"
const require= createRequire(import.meta.url);
import User from '../models/User.js'
import Course from '../models/Course.js'
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

export const isEnrolled=async (req, res, next)=>{
    try{
    const {slug}= req.params;
    const myid= req.user.userid;
    const course= await Course.find({slug: slug , users:{$in:myid}});
    console.log(course);
    if(Object.keys(course).length === 0) return res.status(401).json("Not authorised");
    next();
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}