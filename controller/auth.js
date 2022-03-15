import jwt from "jsonwebtoken"
import User from "../models/User";
const bcrypt = require('bcrypt');

// status 500 for internal server error 
// status 401 for invalid authorisation

export const register= async (req, res)=>{
    try{

        let {name,email,password}= req.body;

        //validation
        if(!name) return res.status(400).json("Name is required");

        if(!password || password.length < 6) return res.status(400).json("Password is required and should be minimum 6 characters long");

        const usrexist= await User.findOne({email});

        if(usrexist)  return res.status(400).json("The email is already taken");

        //password hashing
        password = await bcrypt.hash(password, 12);  //hashing with  12 rounds of salt 

        //new user create
        const newuser=  new User({
           name: name,
           email: email,
           password: password
        });
        console.log("hello");
        await newuser.save();
        return res.status(200).json("Register Successful");
    }
    catch(err)
    {
        return res.status(500).json("Internal server error");
    }
}
export const login= async(req, res)=>{
    try{
    const {email, password}= req.body;
    console.log(req.body);
    const user=await  User.findOne({email});
    if(!user) res.status(401).json("Invalid username or password");
    const comp= await bcrypt.compare(password, user.password);
    if(!comp) res.status(401).json("Invalid username or password");
    // no issues generate jwt token
    const token= jwt.sign({userid: user._id}, process.env.JWT_SECRET , {expiresIn: "30d"});  // user login for 30 days

     res.cookie("token", token);
     user.password=undefined;  // because we dont want to send password and userid in global state
     user._id= undefined;
    res.status(200).json(user);
    }
    catch(err)
    {
        res.status(500).json("Internal server error");
    }

}

export const logout= async (req, res)=>{
    try{
    res.clearCookie("token");
    return res.status(200).json("Succesfully signed out");
    }
    catch(err)
    {
        res.status(500).json("Internal server error");
    }

}

