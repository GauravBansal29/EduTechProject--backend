import {createRequire} from "module"
const require= createRequire(import.meta.url);
const mongoose= require('mongoose');
// new Course created by instructor 
// each course will have many lessons given by the lesson schema


const {ObjectId}= mongoose.Schema;   //in a way to give mongoose.Schema.ObjectId as type

const discussionSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref:'User',
        required:true
    },
    lessonid:{
        type: ObjectId,
        ref:'Lesson',
        required:true
    },
    courseid:{
        type: ObjectId,
        ref:'Course',
        required:true
    },
    value:{
        type:String,
        required: true
    }
    
},
{timestamps:true});

const Discussion= new mongoose.model("Discussion", discussionSchema);

export default Discussion;

