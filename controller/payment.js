
import axios from 'axios'
import User from '../models/User'
import Order from "../models/Order"


const Razorpay= require("razorpay");

export const addContact=async( req, res)=>{
    try{
    const my_id= req.user.userid;
    const userdata= await User.findById(my_id);
    const {name, email, contact}= userdata;
    const key_id= process.env.RAZORPAY_KEY_ID;
    const key_secret= process.env.RAZORPAY_KEY_SECRET;
    const encodedBase64Token = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    const response = await axios({
        url: 'https://api.razorpay.com/v1/contacts',
        method: 'post',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        },
        data: {
            "name":name,
            "email":email,
            "contact":contact,
            "type":"vendor",
    }
    });
    console.log(response.data.id);
    const upd= await User.findOneAndUpdate({_id:my_id}, {pay_contactid: response.data.id});
    
    return  res.status(200).json("Update Successful");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}

export const addFundAccount= async(req,res)=>{
    try{
    const my_id= req.user.userid;
    const {name, account_number, ifsc}= req.body;
    const userdata= await User.findById(my_id);
    const {pay_contactid}= userdata;
    const key_id= process.env.RAZORPAY_KEY_ID;
    const key_secret= process.env.RAZORPAY_KEY_SECRET;
    const encodedBase64Token = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    const response = await axios({
        url: 'https://api.razorpay.com/v1/fund_accounts',
        method: 'post',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        },
        data: {
            "contact_id":pay_contactid,
            "account_type":"bank_account",
            "bank_account":{
              "name":name,
              "ifsc":ifsc,
              "account_number":account_number
            }
    }
    });
    console.log(response.data.id); 
    const upd_user= await User.findByIdAndUpdate( my_id , {fund_account: response.data.id, $push:{role:"Instructor"}},  {new: true}).exec();
        return res.status(200).json(upd_user);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Error occured");
    }

}

export const getRazorpayKey= (req, res)=>{
   res.send({key: process.env.RAZORPAY_KEY_ID});
}


export const createOrder = async(req, res)=>{
    try{
        const instance = new Razorpay({
             key_id: process.env.RAZORPAY_KEY_ID, 
             key_secret: process.env.RAZORPAY_KEY_SECRET 
            });
        // provide amount and currency details while sending request (can add receipt notes partial payment etc over here)
        const options= {
            amount: req.body.amount,
            currency: req.body.currency
        };
        //order will take these parameters
        const order = await instance.orders.create(options);
        if(!order) return res.status(500).json("Some error occured");
        // everything goes fine accept the order
        return res.status(200).json(order);
    }
    catch(err)
    {
        return res.status(500).json(err);
    }

}

// this will be called on successful payment only , we are just storing the payment in the database
//pay signature appears on successful payment

//checking the paysignature is left-> needs to be done to verify actually a order has been done or some forgery has taken place by pushing a request

export const payOrder= async (req, res)=>{
    try{
        const {amount, razorpayPaymentId , razorpayOrderId , razorpaySignature} = req.body;

        const newOrder= new Order({
            isPaid: true,
            amount: amount,
            razorpay:{
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature
            }
        });
        await newOrder.save();

        res.status(200).json("Successful payment");

    }
    catch(err)
    {
        res.status(500).json(err);
    }
}
