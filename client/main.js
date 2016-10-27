var Vue = require('vue');
var table = require('./table.vue');
var Version = require('./version.vue');
var login = require('./login.vue');
var select = require('./select.vue');
var app_version = require('./app_version.vue');
var app_table = require('./app_table.vue');

var VueRouter = require('vue-router');

Vue.use(require('vue-resource'));
Vue.use(VueRouter);

var router = new VueRouter();

var app = Vue.extend({});

router.map({
    '/': {        //登录
        component: login
    },
    '/login': {
        component: login
    },
    /* 404路由 */
    '*': {
        component: login
    },
    '/appversion': {               //主页
        component: table
    },
    '/select': {
        component: select
    },
    '/app_version': {               //主页
        component: app_table
    }
});

router.start(app, "#app");
