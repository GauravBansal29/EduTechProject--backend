
const mongoose= require('mongoose');
// new Course created by instructor 
// each course will have many lessons given by the lesson schema


const {ObjectId}= mongoose.Schema;   //in a way to give mongoose.Schema.ObjectId as type

const completedSchema = new mongoose.Schema({
    user:{
        type: ObjectId,
        ref:'User',
    },
    course:{
        type: ObjectId,
        ref: 'Course'
    },
    lesson:{
        type:ObjectId, 
        ref:'Lesson'
    }
},
{timestamps:true});

const Completed = new mongoose.model("Completed", completedSchema);

module.exports= Completed;

