const mongoose= require('mongoose');

const lessonSchema= new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minlength: 3,
        maxlength:10,
    },
    slug:{
        type:String,
        lowercase:true
    },

    content:{
        type:{},
        minlength: 200
    },
    video_link:{
        type:String, 
    },
    free_preview:{
        type:Boolean,
        default: true
    }
}, 
{timestamps:true});

const Lesson = new mongoose.model("Lesson", lessonSchema);

module.exports= Lesson;