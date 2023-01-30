import {createRequire} from "module"
const require= createRequire(import.meta.url);
const mongoose= require("mongoose");

// to create order after successfull payment 
// Razorpay orders if required later can be used

const orderSchema= new mongoose.Schema(
    {
        isPaid: Boolean,

        amount: Number,

        razorpay:{
            orderId: String,
            paymentId: String,
            signature: String,
        }

    });

const Order= new mongoose.model("Order", orderSchema);

export default Order;
