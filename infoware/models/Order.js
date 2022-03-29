var mongoose = require('mongoose')

var Schema = mongoose.Schema


var OrderSchema = new Schema({
    Date : String,
    Time : String,
    User_Email : String,
    User_Phone : Number,
    Items : []
})


module.exports = mongoose.model('Order',OrderSchema)