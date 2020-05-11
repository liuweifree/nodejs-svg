var express = require('express');
var router = express.Router();

/**跳转到主页*/
router.get('/', function(req, res, next) {
  res.render('wawa/wawa', { title: 'Express' });
});
/**跳转到登录页*/
router.get('/login', function(req, res, next) {
  res.render('login');
});

/**跳转到登录页*/
router.get('/user', function(req, res, next) {
  res.render('user/user');
});

router.get('/setting/category', function(req, res, next) {
  res.render('setting/category');
});

router.get('/setting/tag', function(req, res, next) {
  res.render('setting/tag');
});

/**管理员*/
router.get('/adminmanager', function(req, res, next) {
  res.render('adminmanager/index');
});

/**打赏**/
router.get('/list', function(req, res, next) {
  res.render('reward/reward');
});


router.get('/order', function(req, res, next) {
    res.render('order/order');
});

router.get('/resource', function(req, res, next) {
  res.render('wawa/wawa');
});

router.get('/activity', function(req, res, next) {
  res.render('activity/activity');
});

router.get('/setting/ad', function(req, res, next) {
  res.render('config/ad');
});

router.get('/setting/product', function(req, res, next) {
  res.render('config/product');
});

router.get('/setting/switch', function(req, res, next) {
  res.render('config/switch');
});

router.get('/background', function(req, res, next) {
  res.render('background/background');
});

router.get('/template', function(req, res, next) {
  res.render('template/template');
});

router.get('/recommend', function(req, res, next) {
  res.render('recommend/recommend');
});

router.get('/recommendData', function(req, res, next) {
  res.render('recommend/recommendData');
});

module.exports = router;
