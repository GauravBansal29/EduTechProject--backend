import AWS from 'aws-sdk'
import {nanoid} from 'nanoid'
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

 export const createCourse= async(req, res)=>{
     console.log(req.body);
     return res.status(200).json("course created");
 }