const express=require('express');
const app =express();

//解决跨域
const cors=require('cors');
app.use(cors());

//解析表单的中间件
app.use(express.urlencoded({ extended: false }));

//解析token中间件
const config= require('./config.js');
const expressJWT = require('express-jwt');


//封装res.send函数
app.use(function(req,res,next){
    res.cc=function(err,status=1){
        res.send({
            status:status,
            message:err instanceof Error? err.message:err
        })
    }
    next();
})
//排除/api/开头的不需要验证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({path:[/^\/api\//]}));
//导入用户注册登录路由模块
const router=require('./router/user');
app.use('/api',router);
//导入获取个人信息路由模块
const userinfo=require('./router/userinfo');
app.use('/my',userinfo);
//导入文章管路路由模块
const artCateRouter = require('./router/artcate');
// 为文章分类的路由挂载统一的访问前缀 /my/article
app.use('/my/article', artCateRouter)





app.listen('8080',()=>{
    console.log('localhost:8080');
})

// 捕获表单验证错误的函数
const joi=require('joi');
const { options } = require('./router/user');
// app.use((err,req,res,next)=>{
//      if(err instanceof joi.ValidationError)return res.cc(err);
//      if(err.name === 'UnauthorizedError')return res.cc('身份认证失败！')
//      res.cc(err.message);
     
// })
