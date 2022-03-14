const express= require('express');
const cors= require('cors');
const morgan = require('morgan');
const fs= require('fs');
const mongoose = require('mongoose');  // for database 
require("dotenv").config();  // for environment variables
//////////////////////////////////mongoose connect////////////////////////////////////
// in mongoose.connect we need to paas database url in mongo atlas which we are extracting from env using dotenv module 
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}). then(()=>{console.log("DB connected");}).catch(err=>console.log("err in connecting DB"+ err))  // mongoose.connect returns a promise
////////////////////////////////////////////////////////////////////////////////////

const app = express();

//middlewares 
app.use(cors());
app.use(express.json());  
app.use(morgan("dev")); // for status codes and errors 


const port = 8000;

// defining routes
fs.readdirSync("./routes").map((r)=>{
    app.use("/api" , require(`./routes/${r}`));
})

app.get('/' , (req, res)=>{
    
    console.log('main route');
    res.send("hello to the server");
})

app.listen(port , ()=>{
    console.log(`server is running on ${port}`);
})


