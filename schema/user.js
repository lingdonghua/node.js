//用户信息验证模块
const joi =require('joi');
/**
* string() 值必须是字符串
* alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* min(length) 最小长度
* max(length) 最大长度
* required() 值是必填项，不能为 undefined
* pattern(正则表达式) 值必须符合正则表达式的规则
*/
// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const password = joi
.string()
.pattern(/^[\S]{6,12}$/)
.required()
//昵称认证
const nickname = joi.string()
//email验证规则
 const email=joi.string().pattern(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)
// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
// 表示需要对 req.body 中的数据进行验证
body: {
username,
password,
nickname,
email
},
}
//更新的表单验证
exports.update_schema = {
// 表示需要对 req.body 中的数据进行验证
body: {
nickname,
email
},
}

// 验证规则对象 - 重置密码
exports.update_password_schema = {
    body: {
    // 使用 password 这个规则，验证 req.body.oldPwd 的值
    oldPwd: password,
    // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd
    // 解读：
    // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
    // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
    // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    newPwd: joi.not(joi.ref('oldPwd')).concat(password),
    },
    }


    //用户头像
// dataUri() 指的是如下格式的字符串数据：
// data:image/png;base64,VE9PTUFOWVNFQ1JFVFM=
//required是数据不能为空
const avatar = joi.string().dataUri().required()
exports.update_avatar_schema = {
    body: {
    avatar,
    },
    }


//新增文章模块表单认证
// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 校验规则对象 - 添加分类
exports.add_cate_schema = {
body: {
name,
alias,
},
}

// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required()
// 校验规则对象 - 删除分类
exports.delete_cate_schema = {
    params: {
    id,
    },
    }

//根据id更新文章
exports.update_cate_schema = {
    body: {
    id: id,
    name,
    alias,
    },
    }