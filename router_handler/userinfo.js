//导入数据库模块
const db=require('../db/mysql');
const { route } = require('../router/userinfo');
//导入密码加密中间件npm i bcryptjs@2.4.3
const bcryptjs=require('bcryptjs');
// 获取用户信息
exports.getUserinfo=function(req,res){
    //req.user是jwt解密后自动挂载进去的
    const userId=req.user.id;

    const sql='select * from ev_users where id=?';
    db.query(sql,userId,(err,results)=>{
        if(err){
            return res.cc(err);
        }

        if(results.length!=1){
            return res.cc('获取信息失败');
        }
        const userinfo={...results[0],password:''};
        res.send({
            status:0,
            message:'获取信息成功',
            data:userinfo
        })
    })
}

//更新用户信息
exports.updateUserinfo=function(req,res){
    const newinfo=req.body;
    const updateSql='update ev_users set ? where id=?';
    db.query(updateSql,[newinfo,req.user.id],(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.affectedRows!==1){
            return res.cc('修改失败');
        }
        return res.cc('修改成功',0);
    })
}
//重置密码
exports.updatePassword=function(req,res){
    //根据id查询用户是否存在
    const selectById='select * from ev_users where id=?'
    db.query(selectById,req.user.id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length==0){
            return res.cc('用户已不存在');
        }
        //判断传来的密码是否正确
        const compareResult = bcryptjs.compareSync(req.body.oldPwd, results[0].password);
        if(!compareResult){
            return req.cc('密码错误');
        }
        //根据新密码生成新的加密字符串写入数据库
        const newStr=bcryptjs.hashSync(req.body.newPwd, 10);
        const updatePassword='update ev_users set password=? where id=?';
        db.query(updatePassword,[newStr,req.user.id],(err,results)=>{
            if(err){
                return res.cc(err);
            }
            if(results.affectedRows!=1){
                return res.cc('修改失败，请稍后有再试');
            }
            res.cc('修改成功',0);
        })
    })
}
//更新用户头像
exports.updateAvatar=function(req,res){
    const avatarSql='update ev_users set user_pic=? where id =?';
    db.query(avatarSql,[req.body.avatar,req.user.id],(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.affectedRows==0){
            return res.cc('更新头像失败');
        }
        return res.cc('更新头像成功',0);
    })
}