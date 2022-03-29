var express = require('express')
var router = express.Router();

var User_Service = require('../services/User_services')
var product_service = require('../services/Product_Service')

//user routes
router.post('/SignUp',User_Service.SignUp)
router.get('/getuser',User_Service.allowIfLoggedin,User_Service.getUser)
router.get('/getorderlist',User_Service.allowIfLoggedin,User_Service.grantAccess('readOwn','profile'),User_Service.getOrderList)
router.get('/placeorder',User_Service.allowIfLoggedin,User_Service.PlaceOrder)
router.delete('/deleteprofile',User_Service.allowIfLoggedin,User_Service.grantAccess('deleteAny','profile'),User_Service.DeleteProfile)
router.get('/productlist',User_Service.allowIfLoggedin,User_Service.grantAccess('readAny','product'),product_service.BrowseProducts)
router.post('/login',User_Service.login)







module.exports = router;