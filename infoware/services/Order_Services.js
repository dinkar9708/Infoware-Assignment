var OrderModel = require('../models/Order')




exports.savedetails = (obj)=>{
    var newOrder = new OrderModel(obj);
    newOrder.save()
}


exports.generateOrderId = ()=>{

}