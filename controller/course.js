import {createRequire} from "module"
const require= createRequire(import.meta.url);
import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import Course from '../models/Course.js'
import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import {readFileSync} from 'fs'
const slugify= require('slugify');
const awsconfig= {
    region: process.env.AWS_REGION,
    apiVersion: process.env.AWS_API_VERSION,
    credentials:
    {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
    }
};

const S3 =  new AWS.S3(awsconfig);
 export const imageUpload=async (req,res)=>{
    
    try{
        const {image}= req.body;
        console.log(image);
        console.log(awsconfig);
        if(!image) return res.status(400).json("No Image Found");
        const base64data= new Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const type= image.split(';')[0].split('/')[1];
        const params= {
            Bucket:"edutechproject",
            Key: `${nanoid()}.${type}`,
            Body: base64data,
            ACL: "public-read",
            ContentEncoding: "base64",
            ContentType: `image/${type}`
        };
        S3.upload(params, (err, data)=>{
            if(err)
            {
                console.log(err);
                return res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        });

    }
    catch(err)
    {
        console.log(err);
    }
 }
// function to delete a image from s3
export const removeImage = async(req, res)=>{
    try{
        const {image} = req.body;

        const params= {
            Bucket: image.Bucket,
            Key: image.Key
        };

        S3.deleteObject(params, (err, data)=>{
            if(err)
            {
                console.log(err);
                res.sendStatus(400);
            }
            res.send({ok:true});
        });
        
    }
    catch(err)
     {
         console.log(err);
         return res.status(400).json("Image Delete Unsuccessful");   
     }

}

 export const createCourse= async(req, res)=>{
     console.log(req.body);
     const {name, description, price, paid, image, category}= req.body;
    try{
        const courseexist = await  Course.findOne({
            slug: slugify(name.toLowerCase())
        });
        if(courseexist) return res.status(205).json("Try taking another title");
     const course = new Course({
         name,
         description,
         price,
         paid,
         category,
         instructor: req.user.userid,
         slug: slugify(name.toLowerCase()),
         image
     });
     await course.save();

     return res.status(200).json("Course instance created successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
 }

export const getCourse= async (req, res)=>{
    const {slug}= req.params;
    try{
    const course = await Course.findOne({slug: slug}).populate('instructor', '_id name').exec();
    return res.status(200).json(course);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
    

}

export const videoUpload= async(req, res)=>{
    try{
        const {video}= req.files;
        console.log(video);
        if(!video) return res.status(400).json("No video received at input");
        const params= {
            Bucket:"edutechproject",
            Key: `${nanoid()}.${video.type.split('/')[1]}`,
            Body: readFileSync(video.path),
            ACL: "public-read",
            ContentType: video.type,
        };

        //upload to S3
        S3.upload(params, (err,data)=>{
            if(err)
            {
                console.log(err);
                res.sendStatus(400);
            }
            console.log(data);
            res.send(data);
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}

export const videoDelete= async(req, res)=>{
    try{
    const {video}= req.body;
    if(!video) 
    {
        console.log("no video error");
        return res.status(400).json("No video found");
    }

    const params={
        Key: video.Key,
        Bucket: video.Bucket
    };

    // delete from S3
    S3.deleteObject(params, (err, data)=>{
        if(err)
        {
            console.log(err);
            res.sendStatus(400);
        }
        console.log(data);
        res.send(data);
    });
    }
    catch(err)
    {
        console.log(err.response);
        return res.status(500).json("Internal Server Error");
    }
}

export const addLesson= async(req, res)=>{
    const {slug}= req.params;
    const ins_id= req.user.userid;
    const {title, description, videolink, free_preview}= req.body;
    try{
    const course= await Course.findOne({slug:slug});
    if(course.instructor != ins_id) return res.status(401).json("Invalid User");
    const lessonslug= slugify(slug.toLowerCase());
    console.log(title, description, videolink);
    const newlesson = new Lesson({
        title:title,
        content: description,
        videolink: videolink,
        slug:lessonslug,
        free_preview: free_preview
    });
    await newlesson.save();
    console.log(newlesson);
    const course_up= await Course.findOneAndUpdate({slug: slug}, { $push: {lessons: newlesson}});
    return res.status(200).json("Lesson upload successful");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const updateCourse= async(req, res)=>{
    try{
    const {name, description, price, paid, image, lessons, category}= req.body;
    const {slug}= req.params;
    const course = await Course.findOne({slug: slug});
    if(req.user.userid != course.instructor) return res.status(401).json("Access Unauthorised");
    const courseupd= await Course.findOneAndUpdate({slug:slug}, {
        name,
        description,
        price,
        paid,
        image,
        category,
        slug: slugify(name.toLowerCase()),
        lessons
         });
         return res.status(200).json("Course Updated Successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }


}

export const updateCourseLessons= async (req, res)=>{
    try{
        const {lessons} = req.body;
        const {slug}= req.params;
        const course = await Course.findOne({slug: slug});
        if(req.user.userid != course.instructor) return res.status(401).json("Access Unauthorised");
        const courseupd= await Course.findOneAndUpdate({slug:slug}, {
            lessons
             });
        return res.status(200).json("Course Lessons List Updated Successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const deleteLesson= async (req, res)=>{
    try{
        const {id}= req.params;
        const lesson= await Lesson.findOneAndDelete({_id: id});
        return res.status(200).json("Lesson Deleted Succesfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const updateLesson= async (req, res)=>{
    try{
        const {title , content ,videolink, slug, free_preview}= req.body;
        const {id}= req.params;
        const lesson= await Lesson.findOneAndUpdate({_id: id}, {
            title ,
            content,
            videolink,
            slug,
            free_preview
        });
        return res.status(200).json("Lesson updated successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const publishCourse= async (req, res)=>{
    try{
        const {slug}= req.params;
        const course= await Course.findOne({slug: slug}).select("instructor").exec();
        if(course.instructor != req.user.userid) return req.status(401).json("Unauthorised");

        const updated = await Course.findOneAndUpdate({slug: slug}, {published:true}, {new:true});

        return res.status(200).json("Course published successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const unpublishCourse =  async (req, res)=>{
    try{
        const {slug}= req.params;
        const course= await Course.findOne({slug: slug}).select("instructor").exec();
        if(course.instructor != req.user.userid) return req.status(401).json("Unauthorised");

        const updated = await Course.findOneAndUpdate({slug: slug}, {published:false}, {new:true});

        return res.status(200).json("Course unpublished successfully");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const getpublishedCourses= async (req, res)=>{
    try{
        const allcourses= await Course.find({published:true}).populate('instructor', '_id name').exec();
        return res.status(200).json(allcourses);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const checkEnrollment= async (req, res)=>{
    try{
    const myid= req.user.userid;
    const {slug}= req.params;
    const course= await Course.find({slug: slug , users:{$in:myid}});
    console.log(course);
    return res.status(200).json({
        answer: course
    });
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }

}

export const freeEnrollment= async (req, res)=>{
    try{
        const {id}= req.params;
        const myid= req.user.userid;
        const course= await Course.findOne({_id:id});
        if(!course || course.paid) return res.status(401).json("This is not allowed");
        const courseupd= await Course.findOneAndUpdate({_id: id},{$push:{users:myid}});
        const usrupd= await User.findOneAndUpdate({_id:myid},{$push:{courses:id}});
        return res.status(200).json("Free enrollment completed");
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}

export const userCourses= async(req, res)=>{
    try{
        const userid= req.user.userid;
        const user= await User.findById(userid).exec();
        const courses= await Course.find({_id: {$in: user.courses}}).populate("instructor", "_id name").exec();  //get all courses whose id is in user.courses
        return res.status(200).json(courses);

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
}