import {createRequire} from "module"
const require= createRequire(import.meta.url);
import User from '../models/User.js'
import Course from '../models/Course.js'
import queryString from 'query-string'

const stripe= require('stripe')(process.env.STRIPE_SECRET);

//stripe onboarding 
// will provide the link where we need to redirect
export const makeInstructor=async(req, res)=>{
    try{
        //getting the user
    const user = await User.findById(req.user.userid);  
    //checking if the user has a stripe account 
    if(user.stripe_account_id === "") 
    {
        const account = await stripe.accounts.create({type: 'standard'});
        console.log(account);
        user.stripe_account_id= account.id;
        await user.save();  // save the account id to the user
    }
    // create accountLink for redirect
    let accountLink = await stripe.accountLinks.create({
         account: user.stripe_account_id,
         refresh_url: process.env.STRIPE_REDIRECT_URL,
         return_url: process.env.STRIPE_REDIRECT_URL,
         type: "account_onboarding"
    })

    accountLink= Object.assign(accountLink ,{
        "stripe_user[email]": user.email,

    })

    res.status(200).send(`${accountLink.url}?${queryString.stringify(accountLink)}`)
    

    }
    catch(err)
    {
        console.log(err);
        res.status(500).json("Internal Server Error");
    }
    

}
// after onboarding make instructor -> add role as instructor and stripe seller account details add
export const getAccountStatus = async (req, res)=>{
    try{
    const user = await User.findById(req.user.userid);  // got from jwt middleware 

    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    
    if(!account.charges_enabled)
    {
        return res.status(401).json("Unauthorised access"); // 401 unauthorised status code
    }

    const update= await User.findByIdandUpdate(user._id, {
        stripe_seller: account,
        $addtoSet: {role: "Instructor"},

    }, {new: true}).exec();
    return res.status(200).json(update);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}

// verify that instructor role is present to open instructor routes for the person
export const currentInstructor= async(req, res)=>{
    try{
    const user= await User.findById(req.user.userid).select("-password");
    if(!user.role.includes("Instructor")) 
    {
        console.log("i am here");
        return res.status(403).json("You are not allowed to access this route");
    }
    // verified the person has instructor roles
    return res.status(200).json({ok:true});
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const instructorCourses= async(req, res)=>{
    try{
    const courselist= await Course.find({instructor: req.user.userid}).sort({createdAt: -1});

    return res.status(200).json(courselist);
    }
    catch(err){
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }   
}