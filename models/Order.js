const mongoose= require("mongoose");

// to create order after successfull payment 

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

module.exports = Order;
