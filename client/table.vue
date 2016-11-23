<template>
    <div class="container">
        <table class="table" style="">
            <caption><strong>app详情</strong></caption>
            <thead>
            <tr>
                <th>id</th>
                <th>app名字</th>
                <th>创建时间</th>
                <th>更新时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="success">
                <td><input v-model="editing.id" placeholder="必须填写,且为不重复数字"/></td>
                <td><input v-model="editing.name" placeholder="必须填写"/></td>
                <td><input v-model="editing.createTime" placeholder="必须为时间date格式" type="datetime-local"/></td>
                <td><input v-model="editing.updateTime" placeholder="必须为时间date格式" type="datetime-local"/></td>
                <td>
                    <button class="btn btn-info" @click="addApp" >添加</button>
                </td>
            </tr>

            <tr class="info" v-for="app in apps">
                <td><input v-model="app.id" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.name" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.createTime" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.updateTime" @keyup="updateApp(app) | debounce 500"/>

                </td>

                <td>
                    <button class="btn btn-danger" @click="remove(app)">删除</button>
                </td>
            </tr>
            <!--<browser-item v-for="app in apps" :app="app" @click="selectApp(app)"-->
            <!--:editing-id="editing.id"></browser-item>-->
            </tbody>
        </table>
        <zpagenav></zpagenav>
        <!--<button class="btn btn-info" @click="addApp" style="display:none; float:right;">添加app</button>-->
    </div>

    <version></version>

</template>

<script>
    var apps;

    module.exports = {
        http: {
            root: '/api/v1',
//            headers:{ Authorization: 1231
//
//            }
        },
        events: {
            "remove-app": function (app) {
                var self = this;
                if (confirm(app.name + "确定删除？")) {
                    apps.delete({id: app.id}, function (data, status, request) {
                        self.fetchApps();
                    });
                }
            }
        },

        data: function () {
            return {
                msg: 'Replaceing',
                apps: [],
                editing: {
                    id: "",
                    name: "",
                    createTime: "",
                    updateTime: ""
                }
            }
        },
        methods: {
            addApp: function () {
                var self = this;
                var id = self.editing.id;
                var name = self.editing.name;
                var createTime = self.editing.createTime;
                var updateTime = self.editing.updateTime;
                console.log('id: ' + id + 'name: ' + name + ' ,createTime: ' + createTime + ' , updateTime: ' + updateTime);
                if (id && name) {
                    apps.save({}, {
                        id: id,
                        name: name,
                        createTime: createTime,
                        updateTime: updateTime
                    }, function (data, status, request) {
                        self.editing = data;
                        self.fetchApps();
                    });
                }

            },
            updateApp: function (app) {
                if (app.id || app.id.length > 0) {
                    apps.update({id: app.id}, app, function (data, status, request) {
                        console.log("saved");
                    })
                }
            },
            selectApp: function (app) {
                this.editing = app;

            },
            fetchApps: function () {
                var self = this;
                apps.query({}, function (items, status, request) {
                    self.apps = items;
                })
            },
            remove: function (app) {

                this.$dispatch("remove-app", app);
            },
            refresh: function (page,pageSize) {
                var page=page;
                var pageSize=pageSize;
                var skip=(page - 1) * pageSize;
                var filter={"skip":skip,"limit":pageSize};
                filter=JSON.stringify(filter);
                var access_token = localStorage.getItem('access_token');
                apps = this.$resource('apps/:id?access_token=' + access_token+'&filter='+filter);
                this.fetchApps();
            }
        },
        ready: function () {
            var access_token = localStorage.getItem('access_token');
//            var pageNow=5;
//            var limit=10;
//            var total=55;
            var self=this.$children;
//            console.log(self[1].$data.page)
            var page=self[0].$data.page;
            var pageSize=self[0].$data.pageSize;
            var skip=(page - 1) * pageSize;
            var filter={"skip":skip,"limit":pageSize};
            filter=JSON.stringify(filter);
            apps = this.$resource('apps/:id?access_token=' + access_token+'&filter='+filter);
            this.fetchApps();
        },
        components: {
            version: require("./version.vue"),
            zpagenav: require("./zpagenav.vue")
        }


    }
</script>
