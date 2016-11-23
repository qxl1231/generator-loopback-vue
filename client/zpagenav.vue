<template>
    <div>
        <zpagenav :page="page", :page-size="pageSize", :total="total", :max-link.sync="maxLink" :event-name="eventName" :create-url="createUrl"><zpagenav>
    </div>
</template>

<script>
    var apps;
    //commonjs way
    var Vue = require('vue')
    var zPagenav = require('vue-pagenav')
    Vue.use(zPagenav)

    //or direct use if window.Vue exists
    //Vue.use(window.zPagenav)

    module.exports = {
        http: {
            root: '/api/v1',
//            headers:{ Authorization: 1231
//
//            }
        },
//        props:['page','pageSize'],
        data: function () {
            return {
                page: 1 ,//page
                 pageSize: 10, //pageSize,  default is 10
                 total: 15 //total item count
                , maxLink: 5 //how many links to show, must not less than 5,  default is 5
//                ,eventName:'page-change'
                // page change event name, default is 'page-change',
                // optional
                // for different pagenav, should use different name
                , eventName: 'custom'
            }
        }
        ,events: {
            'custom': function(page) {
                this.page = page;
//                this._data.page = page;

                this.$parent.refresh(page,10);

//                console.log(page);

            },

        },
        methods:{
            fetchApps: function () {
                var self = this;
                apps.query({}, function (items, status, request) {
                    self.total = items.length;
                })
            }
        },
        ready: function () {
            var access_token = localStorage.getItem('access_token');

            apps = this.$resource('apps/:id?access_token=' + access_token);
            this.fetchApps();

        },
    }

</script>