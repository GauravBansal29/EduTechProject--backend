
import axios from 'axios'
import User from '../models/User'
import Order from "../models/Order"
import Course from "../models/Course"

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

export const makePayout= async(req, res)=>{
  try{
      const {amount, instructorid}= req.body;
      const ins= await User.findById(instructorid);
      if(!ins) return res.status(400).json("Instructor not found");
     const fund_account= ins.fund_account;
     if(!fund_account) return res.status(400).json("Fund account not found");
    // amount to be payout (amount)
    // fund_ account_id from instructor 

    const key_id= process.env.RAZORPAY_KEY_ID;
    const key_secret= process.env.RAZORPAY_KEY_SECRET;
    const encodedBase64Token = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    const response = await axios({
        url: 'https://api.razorpay.com/v1/payouts',
        method: 'post',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        },
        data: {
            "account_number": process.env.RAZORPAYX_ACCOUNT_NUMBER,
            "fund_account_id": fund_account,
            "amount": amount,
            "currency": "INR",
            "mode": "IMPS",
            "purpose": "payout",
            "queue_if_low_balance": false,
    }
    });
    console.log(response.data);
    // response.data.id to be pushed into instructor 
    const ins_upd= await User.findByIdAndUpdate(instructorid, {$push:{payouts:response.data.id}});
    return res.status(200).json(response.data);
  }
  catch(err)
  {
    console.log(err);
    return res.status(500).json("Internal Server Error");
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
        const courseid = req.params.id;
        const userid = req.user.userid;
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
        console.log(newOrder);
        //User update
        const courseupd= await Course.findOneAndUpdate({_id: courseid},{$push:{users:userid}});
        const usrupd= await User.findOneAndUpdate({_id:userid},{$push:{ courses:courseid, payments: razorpayOrderId}});
        return res.status(200).json("Successful payment");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json(err);
    }
}

export const fetchPayment= async(req, res)=>{
    try{
    const {orderid}= req.params;
    const userid = req.user.userid;
    const user= await User.findById(userid);
    var instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret:process.env.RAZORPAY_KEY_SECRET });
    const mypayment = await instance.orders.fetchPayments(orderid);
    return res.status(200).json(mypayment);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const fetchPayout= async(req, res)=>{
    try{
    const {payoutid}=req.params;
    const key_id= process.env.RAZORPAY_KEY_ID;
    const key_secret= process.env.RAZORPAY_KEY_SECRET;
    const encodedBase64Token = Buffer.from(`${key_id}:${key_secret}`).toString('base64');
    const authorization = `Basic ${encodedBase64Token}`;
    const {data} = await axios({
        url: `https://api.razorpay.com/v1/payouts/${payoutid}`,
        method: 'get',
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json',
        }
    });
    return res.status(200).json(data);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}