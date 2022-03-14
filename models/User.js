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
    stripe_account_id: "",
    stripe_seller:{},
    stripeSession:{},

}, {timestamps:true});

let User= new mongoose.model("User", newuserSchema);

module.exports= User;