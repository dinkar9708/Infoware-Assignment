const express = require('express');
const mongoose= require('mongoose');
const app = express();
const path = require('path')
const jwt = require('jsonwebtoken')
app.use(express.json())
var user_router = require('./routes/User_router')
var admin_router = require('./routes/admin_router')

const UserModel = require('./models/User');
const bodyParser = require('body-parser');
const { urlencoded } = require('body-parser');

require("dotenv").config({
    path:path.join(__dirname,"/.env")
})

var url = 'mongodb://127.0.0.1:27017/my_database'

mongoose.connect(url);

var db = mongoose.connection;

db.on('connected',function(){
    console.log('connected to database')
});


db.on('error',function(){
    console.log('error in connection');
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(async(req,res,next)=>{
    console.log(req.headers)
    
    if(req.headers["x-access-token"] ){
        
        const accessToken = req.headers["x-access-token"];
        const {userId,exp} = await jwt.verify(accessToken,process.env.JWT_SECRET);
        console.log(exp)
       if(exp>Date().valueOf()/1000){
            return res.status(401).json({
                error: "JWT token has been expired"
            })
        }
        //console.log("reached here")
        res.locals.loggedInuser = await UserModel.findById(userId);
    next()
    }
    else{
        next();
    }
    
})
app.use('/user',user_router)
app.use('/admin',admin_router)

app.listen(3000,()=>{
    console.log("server is running")
})