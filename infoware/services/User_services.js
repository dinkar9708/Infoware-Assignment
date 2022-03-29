var UserModel = require('../models/User')
var Product_Service = require('../services/Product_Service')
var OrderModel = require('../models/Order')
var bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')




const {roles} = require('../roles')

exports.grantAccess = function(action,resource){
    return async(req,res,next)=>{
        try{
            console.log(resource)
            const permission = roles.can(req.user.Role)[action](resource);
            
            if(!permission.granted){
                return res.status(401).json({
                    error: "you don't have enough permission"
                }
                )
            }
            next()
        }
        catch(err){
            next(err)
        }
    }
}

exports.allowIfLoggedin = async(req,res,next)=>{
     try{
         const user = res.locals.loggedInuser;
        // console.log(user)
         if(!user){
             return res.status(401).json({
                 error: "you need to login first"
             });
         }
         req.user = user;
         next()
     }
     catch(err){
         next(err)
     }
}

async function hashPassword(Password){
    return await bcrypt.hash(Password,10)
}

async function validatePassword(plainPassword,hashedPassword){
    return await bcrypt.compare(plainPassword,hashedPassword)
}
exports.SignUp = async(req,res,next)=>{
    try{
    const {Name,Mobile_No,Email,Password,Role} = req.body;
    const hashedPassword = await hashPassword(Password)
    const newUser = new UserModel({Name,Mobile_No,Email,Password:hashedPassword,Role: Role || "basic"})
    const accessToken = jwt.sign({userId: newUser._id},process.env.JWT_SECRET,{
        expiresIn: "2h"
    })
    newUser.accessToken = accessToken;
    await newUser.save()
    console.log(newUser)
    res.json({
        data: newUser,
        accessToken
    })
}
catch(err){
    next(err)
}
    
    
}

exports.login = async(req,res,next)=>{
    try{
        
        const{Email,Password} = req.body
        console.log(Email)
        const user = await UserModel.findOne({Email});
        if(!user){return next(new Error("Email does not exist"))}
        console.log(user)
        const validPassword = await validatePassword(Password,user.Password)
        if(!validPassword){return next(new Error("Incorrect Password"))}
        const accessToken = jwt.sign({userId: user._id},process.env.JWT_SECRET,{
            expiresIn: "2h"
        });
        await UserModel.findByIdAndUpdate(user._id,{accessToken})
        res.status(200).json({
            data: {Email: user.Email,role: user.role},
            accessToken

        })

    }
    catch(err){
        next(err)
    }
    

}

exports.getUser = async(req,res,next)=>{
    try{
        var user = await UserModel.findOne({Email: req.body.Email})
        res.send(user)
    }
    catch(err){
        next(err)
    }
}


exports.getOrderList = async(req,res,next)=>{
    try{
    var UserEmail = req.body.Email;
    var OrderList = await OrderModel.find({User_Email: UserEmail})
    res.send(OrderList)
    }
    catch(err){
        next(err)
    }
    
}

exports.PlaceOrder = async(req,res)=>{
    try{
    var productlist = req.body.products;
    var UserEmail = req.body.Email;
    var UserPhone = req.body.Phone;
    var newOrder = new OrderModel();
    var outofstock = 0;
    for(product of productlist){
       //console.log(productlist)
        var oldvalue =  await Product_Service.findProduct({Category: product.Category,Size : product.Size,Colour : product.Colour,Price : product.Price}); //finding product from list of products added by user
       
      //console.log('oldvalue: ' +oldvalue)
       if(oldvalue.Quantity === 0){
           outofstock = 1;
       }
       else{
       var newvalue = oldvalue;
       newvalue.Quantity -= product.Quantity;
       //console.log(oldvalue)
       if(newvalue.Quantity < 0){
           outofstock = 1;
       }
       else{
        await Product_Service.UpdateProductQuantity(oldvalue,newvalue); //updating Quantity of Product
        //console.log("product updated")
        
        newOrder.Items.push({product})

       // res.send(newvalue); //sending updated quantity available
       }
     
    }
    
     }
     if(outofstock === 1){
        res.send('one or more product out of stock')
     }
     else{
        var currentdate = new Date()
        newOrder.Date =  currentdate.getDay().toString() + ":" + currentdate.getMonth().toString() + ":" + currentdate.getFullYear().toString();
        newOrder.Time = currentdate.getHours().toString() + ":" + currentdate.getMinutes().toString()+  ":" + currentdate.getSeconds()
        newOrder.User_Email = UserEmail;
        newOrder.User_Phone = UserPhone;
        newOrder.save()
        res.send(newOrder);
     }}
     catch(err){
         next(err)
     }
   
    

}
exports.DeleteProfile= async(req,res)=>{
    try{
    const Email = req.body.Email;
    await UserModel.findOneAndDelete({Email: Email});
    await OrderModel.deleteMany({User_Email: Email})
    res.send(req.body)
    }
    catch(err){
        next(err)
    }
}


















