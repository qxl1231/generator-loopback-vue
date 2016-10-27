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
                <td><input v-model="editing_app.id" placeholder="必须填写,且为不重复数字"/></td>
                <td><input v-model="editing_app.name" placeholder="必须填写"/></td>
                <td><input v-model="editing_app.createTime" placeholder="必须为时间date格式" type="datetime-local"/></td>
                <td><input v-model="editing_app.updateTime" placeholder="必须为时间date格式" type="datetime-local"/></td>
                <td><button class="btn btn-info" v-on:click="addAppId" >添加</button></td>
            </tr>

            <tr class="info" v-for="app in apps">
                <td><input v-model="app.id" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.name" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.createTime" @keyup="updateApp(app) | debounce 500"/>
                <td><input v-model="app.updateTime" @keyup="updateApp(app) | debounce 500"/>
                <td>
                    <button class="btn btn-danger" @click="remove(app)">删除</button>
                </td>
            </tr>
            <!--<browser-item v-for="app in apps" :app="app" @click="selectApp(app)"-->
            <!--:editing_app-id="editing_app.id"></browser-item>-->
            </tbody>
        </table>
    </div>
    <version></version>
</template>

<script>
    var apps;

    module.exports = {
        http: {
            root: '/api/v1',
        },
        events: {
            "remove-app": function (app) {
                var self = this;
                if (confirm(app.name + "确定删除？")) {
                    apps.delete({id: app.id}, function (data, status, request) {
                        self.fetchApps();
                    });
                }
            },
            "add-app": function() {
              var self = this;
              var id = self.editing_app.id;
              var name = self.editing_app.name;
              var createTime = self.editing_app.createTime;
              var updateTime = self.editing_app.updateTime;

              console.log("id:" + id + ", name: " + name + ",create:" + createTime + ",update:" + updateTime);
              if (confirm("id:" + id + ", name: " + name + ",create:" + createTime + ",update:" + updateTime)) {
                if (id && name) {
                    if (!createTime) {
                      createTime = new Date();
                    }
                    if (!updateTime) {
                      updateTime = new Date();
                    }
                    apps.save({}, {
                        id: id,
                        name: name,
                        createTime: createTime,
                        updateTime: updateTime
                    }, function (data, status, request) {
                        console.log('data: ' + data + ', status: ' + status);
                        self.editing_app = data;
                        self.fetchApps();
                    });
                }
              }
            }
        },
        data: function () {
            return {
                msg: 'Replaceing',
                apps: [],
                editing_app: {
                    id: "",
                    name: "",
                    createTime: "",
                    updateTime: ""
                }
            }
        },
        methods: {
            addAppId: function () {
              console.log('add-app');
              this.$dispatch("add-app");
            },
            updateApp: function (app) {
                if (app.id || app.id.length > 0) {
                    apps.update({id: app.id}, app, function (data, status, request) {
                        console.log("saved");
                    })
                }
            },
            selectApp: function (app) {
                this.editing_app = app;

            },
            fetchApps: function () {
                var self = this;
                apps.query({}, function (items, status, request) {
                    self.apps = items;
                })
            },
            remove: function (app) {
                this.$dispatch("remove-app", app);
            }
        },
        ready: function () {
            var access_token = localStorage.getItem('access_token');
            apps = this.$resource('apps/:id?access_token=' + access_token);
            this.fetchApps();
        },
        components: {
            version: require("./app_version.vue")
        }


    }
</script>
