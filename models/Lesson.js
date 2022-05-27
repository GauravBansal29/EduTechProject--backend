const mongoose= require('mongoose');

const lessonSchema= new mongoose.Schema({
    title:{
        type:String,
        required: true,
        minlength: 3,
        maxlength:30,
    },
    slug:{
        type:String,
        lowercase:true
    },

    content:{
        type:Object,
        minlength: 10
    },
    videolink:{
        type:Object,
        required: true
    },
    free_preview:{
        type:Boolean,
        default: true
    }
}, 
{timestamps:true});

const Lesson = new mongoose.model("Lesson", lessonSchema);

module.exports= Lesson;