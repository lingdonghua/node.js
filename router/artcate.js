//文章管理路由
const express=require('express');
const router=express.Router();
//导入函数模块
const artcate_handler=require('../router_handler/artcate');
//导入用户信息验证模块
const expressJoi=require('@escook/express-joi');
const { add_cate_schema }=require('../schema/user')
const { delete_cate_schema }=require('../schema/user')
const { update_cate_schema }=require('../schema/user')
// 获取文章分类的列表数据
router.get('/cates',artcate_handler.getArticleCates);

//新增文章
router.post('/addcates',expressJoi(add_cate_schema),artcate_handler.addArticleCates);
//根据ID删除文章
router.get('/deletecate/:id',expressJoi(delete_cate_schema),artcate_handler.deleteCateById);
//根据id获取文章
router.get('/cates/:id',expressJoi(delete_cate_schema),artcate_handler.getArticleById)

// 根据id更新文章分类的路由
router.post('/updatecate',expressJoi(update_cate_schema),artcate_handler.updateCateById)

module.exports=router;