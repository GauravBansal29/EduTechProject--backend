
const mongoose= require('mongoose');
// new Course created by instructor 
// each course will have many lessons given by the lesson schema


const {ObjectId}= mongoose.Schema;   //in a way to give mongoose.Schema.ObjectId as type

const courseSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
        minlength:5,
        maxlength: 50,
        trim:true
    },
    slug:{
        type:String,
        lowercase:true
    },
    category:String,
    published:{
        type: Boolean,
        default:false
    },
    paid:{
        type:Boolean,
        default: true
    },
    price:{
        type:Number,
        required: true,
        default:100
    },
    description:{
        type:String,
        minlength:50,
    },
    image:{
        type: String
    },
    instructor:{
        type: ObjectId,
        ref:'User',
        required: true
    },
    users:{
        type: Array
    },
    lessons:[{type:ObjectId , ref:'Lesson'}]
},
{timestamps:true});

const Course= new mongoose.model("Course", courseSchema);

module.exports= Course;

