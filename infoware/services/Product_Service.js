var ProductModel = require('../models/Product')



exports.savedetails = (req,res)=>{
    const newProduct = new ProductModel(req.body);
    try{
        newProduct.save()
        res.send('Product Details added')
    }
    catch(error){
        console.log('error detected')
        res.send('error detected')
    }
}


exports.BrowseProducts = (req,res)=>{
    var productlist = [];
    ProductModel.find({},function(err,products){
        for(product of products){
            if(product.Quantity > 0){
                productlist.push(product)
            }
            
        }
         res.send(productlist);
    })
    
    console.log(productlist)
    
}

exports.findProduct = async(obj)=>{
    
    //console.log("recieved obj   " + obj.Category)
    return await ProductModel.findOne(obj)
     
}

exports.UpdateProductQuantity = async(previousvalue,newvalue)=>{
    console.log("previousvalue" +previousvalue)
    await ProductModel.findByIdAndUpdate(previousvalue.id,{$set:{Quantity:newvalue.Quantity}}) 
}
