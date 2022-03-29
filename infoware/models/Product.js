var mongoose = require('mongoose')

var Schema = mongoose.Schema;


var ProductSchema = new Schema({
    Category  : String,
    Size: String,
    Price: Number,
    Colour: String,
    Quantity: Number
})


module.exports = mongoose.model('Product',ProductSchema)