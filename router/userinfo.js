//获取用户信息路由模块
const express=require('express');
const userinfoRouter=require('../router_handler/userinfo.js');
const router=express.Router();
//导入表单认证模块
const expressJoi=require('@escook/express-joi');
const { update_schema }=require("../schema/user");
const { update_password_schema }=require('../schema/user')
const { update_avatar_schema }=require('../schema/user')

//获取用户信息
router.get('/userinfo',userinfoRouter.getUserinfo)
//更新用户信息
router.post('/userinfo',expressJoi(update_schema),userinfoRouter.updateUserinfo);
//重置密码
router.post('/updatepwd',expressJoi(update_password_schema),userinfoRouter.updatePassword);
//更新用户头像
router.post('/update/avatar',expressJoi(update_avatar_schema), userinfoRouter.updateAvatar)
module.exports=router;