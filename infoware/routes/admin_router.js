var express = require('express')

var router = express.Router();
var product_service = require('../services/Product_Service')
var user_service = require('../services/User_services')

router.post('/addproduct',user_service.allowIfLoggedin,user_service.grantAccess('createAny','product'),product_service.savedetails)
router.post('/login',user_service.login)




module.exports = router;