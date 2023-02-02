import {} from 'dotenv/config'
import {createRequire} from "module"
const require= createRequire(import.meta.url);

import auth from "./routes/auth.js"
import completed from "./routes/completed.js"
import course from "./routes/course.js"
import discussion from "./routes/discussion.js"
import instructor from "./routes/instructor.js"
import payment from "./routes/payment.js"
const express= require('express');
const cors= require('cors');
const morgan = require('morgan');
const fs= require('fs');
const cookieParser= require('cookie-parser');
const csrf= require('csurf');
const mongoose = require('mongoose');  // for database 




//////////////////////////////////mongoose connect////////////////////////////////////
// in mongoose.connect we need to paas database url in mongo atlas which we are extracting from env using dotenv module 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}). then(()=>{console.log("DB connected");}).catch(err=>console.log("err in connecting DB"+ err))  // mongoose.connect returns a promise
////////////////////////////////////////////////////////////////////////////////////

const app = express();
const maxRequestBodySize = '1mb';
app.use(express.json({limit: maxRequestBodySize}));
app.use(express.urlencoded({limit: maxRequestBodySize}));


//middlewares 
app.use(cors());
//app.use(express.json());  
app.use(morgan("dev")); // for status codes and errors 
app.use(cookieParser());

const csrfProtection= csrf({cookie:{
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
}});


// app.use(csrfProtection);
// defining routes
// fs.readdirSync("./routes").map((r)=>{
    
//     app.use("/api" , require(`./routes/${r}`));
   
// })
app.use("/api", auth);
app.use("/api", completed);
app.use("/api", course);
app.use("/api", discussion);
app.use("/api", instructor);
app.use("/api", payment);

app.get('/api/csrf-token', (req, res)=>{
    console.log(req.csrfToken());
    return res.status(200).json({csrfToken: req.csrfToken() });
  })

// port using process.env for deployment
const port = process.env.PORT || 8000;
app.listen(port , ()=>{
    console.log(`server is running on ${port}`);
})


