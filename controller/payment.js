const Razorpay= require("razorpay");
import Order from "../models/Order"
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