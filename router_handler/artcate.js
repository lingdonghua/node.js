//导入数据库模块
const { result } = require('@hapi/joi/lib/base');
const db=require('../db/mysql');

//文章管理函数处理模块
exports.getArticleCates=(req,res)=>{
    const selectList='select * from ev_artide_cate where is_delete=0 order by id ASC';
    db.query(selectList,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length==0){
            return res.cc('获取失败');
        }
        return res.send({
            status:0,
            msg:'获取成功',
            data:results
        })
    })
}

//新增文章函数处理模块
exports.addArticleCates=(req,res)=>{
    //查询数据库，查看新增的文章name和alias（别名）是否存在
   const articleInfo=req.body;
   const selectSql='select * from ev_artide_cate where is_delete<>1 and (name=? or alias=?)';
   db.query(selectSql,[articleInfo.name,articleInfo.alias],(err,results)=>{
    if(err){
        return res.cc(err);
    }
    console.log(results);
    if(results.length==2)return res.cc('分类名称与别名被占用，请更换后重试！')
    // 分别判断 分类名称 和 分类别名 是否被占用
    if (results.length === 1 && results[0].name === req.body.name) 
    return res.cc('分类名称被占用，请更换后重试！')
    if (results.length === 1 && results[0].alias === req.body.alias) 
    return res.cc('分类别名被占用，请更换后重试！')

    //判断是不是存在数据库，但是is_delete=1被删除了
    const deleteSql='select * from ev_artide_cate where is_delete=1 and name=?'
    db.query(deleteSql,articleInfo.name,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length==1){
            const sql='update ev_artide_cate set is_delete=0 where name=?'
            db.query(sql,articleInfo.name,(err,results)=>{
                if(err){
                    return res.cc(err);
                }
                if(results.affectedRows==0) return res.cc('新增失败，稍后再试');
                return res.cc('新增成功',0)
            })
        }else{
            //名字没有被占用写入数据库
            const insertSql='insert into ev_artide_cate set ?'
            db.query(insertSql,articleInfo,(err,results)=>{
            if(err){
                return res.cc(err);
            }
            if(results.affectedRows==0)return res.cc('新增失败，稍后再试');
            return res.cc('新增成功',0)
            })
        }
    })
   })
}

//根据id删除文章
exports.deleteCateById=(req,res)=>{
    const id=req.params.id;
    console.log(id);
    const sql='update ev_artide_cate set is_delete=1 where id=?'
    db.query(sql,id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        console.log(results);
        if(results.affectedRows==0) return res.cc('删除失败，稍后再试');
        return res.cc('删除成功',0)
    })
}

//更具文章id获取文章
exports.getArticleById=(req,res)=>{
    const id=req.params.id;
    const sql='select * from ev_artide_cate where id=?'
    db.query(sql,id,(err,results)=>{
        if(err){
            return res.cc(err);
        }
        console.log(results);
        if(results.length==0) return res.cc('获取失败，稍后再试');
        return res.send({
            status:0,
            msg:'获取成功',
            data:results   
        })
   })
}

//更新文章路由函数
exports.updateCateById=(req,res)=>{
    //检测要更改的数据是否存在（防止重复）
    const artcateInfo=req.body;
    //查询id不等于用户传来的id的数据字段是否被占用（查询除了用于要修改的那个文章以外的文章）
    const sql='select * from  ev_artide_cate where id<>? and (name=? or alias=?)'
    db.query(sql,[artcateInfo.id,artcateInfo.name,artcateInfo.alias],(err,results)=>{
        if(err){
            return res.cc(err);
        }
        if(results.length==2)return res.cc('分类名称与别名被占用，请更换后重试！')
        // 分别判断 分类名称 和 分类别名 是否被占用
        if (results.length === 1 && results[0].name === req.body.name) 
        return res.cc('分类名称被占用，请更换后重试！')
        if (results.length === 1 && results[0].alias === req.body.alias) 
        return res.cc('分类别名被占用，请更换后重试！')
        //不存在同名冲突，允许修改
        const updateSql='update ev_artide_cate set name=? ,alias=? where id=?'
        db.query(updateSql,[artcateInfo.name,artcateInfo.alias,artcateInfo.id],(err,results)=>{
            if(err){
                return res.cc(err);
            }
            if(results.affectedRows==0) return res.cc('更新失败，稍后再试');
            return res.cc('更新成功',0)
        })

    })
}
