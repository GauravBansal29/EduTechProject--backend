import Discussion from "../models/Discussion"
import User from "../models/User"

export const getLessonDiscussion= async (req, res)=>{
    try{
        const {courseid}= req.params;
        const coursediscussion= await Discussion.find({courseid: courseid }).populate('user', 'name _id').exec();
        return res.status(200).json(coursediscussion);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal server Error");
    }
}

export const addDiscussion= async (req, res)=>{
    try{
        const userid = req.user.userid;
        const {courseid, lessonid, value}= req.body;
        
        const newdiscussion= new Discussion({
            user: userid,
            courseid, 
            lessonid,
            value
        });
        await newdiscussion.save();
        return res.status(200).json(newdiscussion);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal server Error");
    }
}