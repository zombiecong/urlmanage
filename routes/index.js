var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var markdown = require('markdown').markdown;

var Url = require('../models/url.js');
var User = require('../models/user.js');
var Meta = require('../models/meta.js');

function checkLogin(req,res,next){
    if(!req.session.user){
        req.flash('error','未登录');
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录');
        return res.redirect('back')
    }
    next()
}
/*URL list*/
router.get('/', function(req, res, next) {

    Meta.get('content',function(err,meta){
        res.render('index', {
            mainContent : markdown.toHTML(meta.value),
            user : req.session.user
        });
    });

});


/*add content*/
router.get('/addMain', checkLogin);
router.get('/addMain', function(req, res) {
    res.render('addMain');
});

router.post('/addMain', checkLogin);
router.post('/addMain', function(req, res) {
    var content = req.body.content;
    newMeta = new Meta({
        key : 'content',
        value : content  
    });
    newMeta.save(function(err,doc){
        res.send('ok');
    });
});


/*edit content*/

router.get('/editMain', checkLogin);
router.get('/editMain', function(req, res) {
    Meta.get('content',function(err,meta){
        res.render('editMain',{content:meta.value});
    });
});

router.post('/editMain', checkLogin);
router.post('/editMain', function(req, res) {
    var content = req.body.content;
    Meta.update(content,function(err,doc){
        res.send('ok');
    });
});


/*edit title*/
router.get('/editTitle', checkLogin);
router.get('/editTitle', function(req, res) {
    res.render('editTitle')
});

router.post('/editTitle', checkLogin);
router.post('/editTitle', function(req, res) {
    newMeta = new Meta({
        key : req.body.key,
        value : req.body.value
    });

    newMeta.save(function(err,doc){
        res.redirect("/");
    });
});


/*add URL*/
router.get('/addUrl', checkLogin);
router.get('/addUrl', function(req, res) {
    res.render('addUrl');
});

router.post('/addUrl', checkLogin);
router.post('/addUrl', function(req, res) {

    newUrl = new Url({
        link : req.body.link,
        content : req.body.content
    });

    newUrl.save(function (err, doc) {
            res.redirect("/");
    });

});
/*delete URL*/
router.get('/delete/:tagId', checkLogin);
router.get('/delete/:tagId', function(req, res, next) {

    var tagId = req.params.tagId

    Url.remove(tagId,function () {
        return res.redirect("/");
    });
});

//login
router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login',function(req, res ){
    //生成密码md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    //检查用户是否存在
    User.get(req.body.username, function(err,user){
        if (!user){
          req.flash('error', '用户不存在!'); 
          return res.redirect('/login');//用户不存在则跳转到登录页
        }
        //检查密码是否一致
        if (user.password != password){
            req.flash('error','密码错误');
            return res.redirect('/login');//密码错误则跳转到登录页
        }
        //登录成功
        req.session.user = user ;
        return res.redirect('/');//密码错误则跳转到登录页
    });

});

//register
/*
router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    var name = req.body.username,
        password = req.body.password,
        password_re = req.body.re_password;
    //检验用户两次输入的密码是否一致
    if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!'); 
        return res.redirect('/register');//返回主册页
    }
    //生成密码 md5值
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name : name,
        password : password
    });
    //检查用户名是否已经存在

    User.get(newUser.name,function(err,user){
        if (err) {
          req.flash('error', err);
          return res.redirect('/');
        }
        if (user) {

          req.flash('error', '用户已存在!');
          return res.redirect('/register');//返回注册页
        }
        //如果不存在则新增用户
        newUser.save(function(err,user){
            if(err){
                req.flash('error',err)
                return res.redirect('/register');//注册失败返回主册页
            }
            req.session.user = user;
            req.flash('success', '注册成功!');
            return res.redirect('/register');
        });
    });
})
*/
//登出
// router.get('/logout', checkNotLogin);
router.get('/logout', function (req, res) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

module.exports = router;
