import {createRequire} from "module"
const require= createRequire(import.meta.url);
import Completed from "../models/Completed.js"
import User from "../models/User.js"
import Course from "../models/Course.js"
import Lesson from "../models/Lesson.js"
export const markComplete= async (req, res)=>{
    try{
        const userid=req.user.userid;
        const {courseid , lessonid} =req.body;
        const completelesson= new Completed({
            lesson: lessonid,
            user: userid,
            course: courseid
        });
        await completelesson.save();
        return res.status(200).json("Marked as complete")
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");

    }

}

export const markIncomplete= async (req,res)=>{
    try{
        const userid=req.user.userid;
        const {courseid , lessonid} =req.body;
        const deletecompleted= await Completed.deleteOne({
            lesson: lessonid,
            user: userid,
            course: courseid
        });
        return res.status(200).json("Deleted Complete Status")
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}

export const completedCourses= async (req,res)=>{
    try{
        const userid= req.user.userid;
        const {course} =req.params;
        const completedata= await Completed.find({course: course, user:userid});
        return res.status(200).json(completedata);
    }
    catch(err)
    {   
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}