
import axios from 'axios'
import User from '../models/User'

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