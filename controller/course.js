import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
import { isGeneratorFunction } from 'util/types';
import Course from '../models/Course'
import User from '../models/User';
const slugify= require('slugify');
const awsconfig= {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_REGION,
    apiVersion:process.env.AWS_API_VERSION,
};

const S3 =  new AWS.S3(awsconfig);
 export const imageUpload=async (req,res)=>{
    try{
        const {image}= req.body;
        if(!image) return res.status(400).json("No Image Found");
        const base64data= new Buffer.from(image.replace(/^data:image\/w+;base64,/, ""), "base64");
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
        const {image} = req.body();

        const params= {
            Bucket: image.Bucket,
            Key: image.key
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
     const {name, description, price, paid, image}= req.body;
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
    const course = await Course.findOne({slug: slug});
    return res.status(200).json(course);
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json("Internal Server Error");
    }
    

}