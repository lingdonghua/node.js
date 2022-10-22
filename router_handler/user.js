//导入数据库的模块
const db=require('../db/mysql')
//导入密码加密中间件npm i bcryptjs@2.4.3
const bcryptjs=require('bcryptjs');

//路由函数处理模块
module.exports.register=function(req,res){
    const userinfo=req.body;
    //查数据库用户名是否重复
    console.log(userinfo);
    const selectSql='select * from ev_users where username=?';
    db.query(selectSql,userinfo.username,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length>0){
            return res.cc('用户名已存在');
        }
    //用户名密码合法，写入数据库
    //密码加密
        userinfo.password=bcryptjs.hashSync(userinfo.password, 10);
        const insert='insert into ev_users set ?'
        console.log(typeof userinfo);
        console.log(userinfo);
        db.query(insert,userinfo,(err,result)=>{
            if(err){
                return res.cc(err);
            }
            if(result.affectedRows !=1){
                return res.cc('注册失败，请稍后再试');
            }
            res.cc('注册成功',0);
        })
    })
   
}
//登录
module.exports.login=function(req,res){
    const userinfo=req.body;
    const selectSQl='select * from ev_users where username=?';
    db.query(selectSQl,userinfo.username,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length==0){
            return res.cc('登录失败');
        }

        //提取数据库密码和用户传来的密码比较
        const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password)
        if(!compareResult){
            return res.cc('密码错误');
        }
        //登录成功，生成token字符串
        //通过 ES6 的高级语法，快速剔除 密码 和 头像 的值
        const user={...results[0],password:'',user_pic:''};
        console.log(user);
        //导入密钥模块
        const jwt=require('jsonwebtoken');
        const config=require('../config.js');
        const token=jwt.sign(user,config.jwtSecretKey,{expiresIn: '10h'})
        res.send({
            status:0,
            message:"登陆成功",
            token:'Bearer '+token
        })
    })

}