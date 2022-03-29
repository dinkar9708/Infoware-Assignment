const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    Name : String,
    Mobile_No: {
        type: Number,
        unique:true
    },
    Email:{
        type: String,
        unique: true
    },
    Password: String,
    
    Role:{
        type : String,
        default: "basic",
        enum: ["basic","admin"]
    },
    accessToken:{
      type: String
    }

});

module.exports = mongoose.model('User',UserSchema)