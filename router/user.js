//管路路由模块
const express=require('express');
const router=express.Router();
const router_handle=require('../router_handler/user');

//导入用户信息验证模块
const expressJoi=require('@escook/express-joi');
const { reg_login_schema }=require("../schema/user.js");
//
// 注册
router.post('/register',expressJoi(reg_login_schema),router_handle.register)

//登录
router.post('/login',expressJoi(reg_login_schema),router_handle.login);

module.exports=router;