var Vue = require('vue')
var App = require('./table.vue')
var Version = require('./version.vue')
var Login = require('./login.vue')


Vue.use(require('vue-resource'));

new Vue({
    el: 'body',
    components: {
        app: App,
        version: Version,
        login:Login
    }
})
