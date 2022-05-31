const mongoose= require('mongoose');
// taken an array in role because a single id can perform multiple roles
const newuserSchema= new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    }, 
    contact:{
        type:Number
    },
    password:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        default:"/blabla.png"
    },
    role:{
        type: [String],
        default:["Subscriber"],
        enum:["Subscriber","Instructor","Admin"]
    },
    forgot_password_id:{
        type:String,
        default:""
    },
    stripe_account_id: {
        type: String,
        default:""
    },
    stripe_seller:{},
    stripeSession:{},
    pay_contactid:{
        type:String
    },
    fund_account:{
        type:String
    }
    
}, {timestamps:true});

let User= new mongoose.model("User", newuserSchema);

module.exports= User;