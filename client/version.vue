<template>
    <div class="container">

        <form role="form" style="display:none" id="selectid"><strong>请选择appID:</strong>

            <div class="form-group">
                <select v-model="value" @change="changeFunc(value)" class="form-control">
                    <!--<option value="1">1</option>-->

                    <option v-for="mapp in myapp" v-bind:value="mapp.id">{{mapp.id}}</option>
                </select>
                <!--<span>Selected: {{ value }}</span>-->
            </div>
        </form>


        <table class="table" style="display:none">
            <caption><strong>app下版本号</strong></caption>
            <thead>
            <tr>
                <th>id</th>
                <th>versionType</th>
                <th>url</th>
                <th>h5Version</th>
                <th>binMax</th>
                <th>binMin</th>
                <!--<th class="col-2">appId</th>-->
                <th class="col-2">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="success">
                <td><input v-model="editing.id" placeholder="可以不填"/></td>
                <td><input v-model="editing.versionType" placeholder="必须填写"/></td>
                <td><input v-model="editing.url" placeholder="可以不填,zip包下载地址"/></td>
                <td><input v-model="editing.h5Version" placeholder="可以不填,ex:4.0.0"/></td>
                <td><input v-model="editing.binMax" placeholder="可以不填,ex:5.0.0"/></td>
                <td><input v-model="editing.binMin" placeholder="可以不填,ex:1.0.0"/></td>
                <td>
                    <button class="btn btn-info" @click="addApp" style="display:none;">添加</button>
                </td>
            </tr>

            <tr class="info" v-for="app in apps">

                <td><input v-model="app.id" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.versionType" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.url" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.h5Version" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.binMax" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.binMin" @keyup="updateApp(app) | debounce 500"/></td>
                <!--<td><input v-model="app.appId" @keyup="updateApp(app) | debounce 500" readonly/></td>-->
                <td>
                    <button class="btn btn-danger" @click="remove(app)">删除</button>
                </td>
            </tr>

            </tbody>
        </table>


    </div>
</template>

<script>
    var apps;

    module.exports = {
        props: ["appid"],

        http: {
            root: '/api'
        },
        events: {
            "remove-app": function (app) {
                var self = this;
                if (confirm(app.id + "确定删除？")) {
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
                myapp: [],
                value: "",
                editing: {
                    id: "",
                    versionType: "",
                    url: "",
                    h5Version: "",
                    binMax: "",
                    binMin: "",
                    appId: ""

                }
            }
        },
        methods: {
            addApp: function () {
                var self = this;

                var versionType = self.editing.versionType;
//                console.log(versionType);
                var url = self.editing.url;
                var h5Version = self.editing.h5Version;

                var binMax = self.editing.binMax;

                var binMin = self.editing.binMin;

                if (versionType) {
                    apps.save({}, {
                        versionType: versionType,
                        url: url,
                        h5Version: h5Version,
                        binMax: binMax,
                        binMin: binMin
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
            changeFunc: function (value) {

                var self = this;
//               // GET request
//                self.$http({url: '/api/apps', method: 'GET'}).then(function (response) {
//                    // success callback
//                    self.myapp = response.data;
//                }, function (response) {
//                    // error callback
//                });
                var resurl = 'apps/' + value + '/versions/:id';
                apps = self.$resource(resurl);
                this.fetchApps();


            }
        },
        ready: function () {
            var self = this;
            // GET request
            self.$http({url: '/api/apps', method: 'GET'}).then(function (response) {
                // success callback
                self.myapp = response.data;
                console.log(self.myapp[0].id);
                self.changeFunc(self.myapp[0].id);
            }, function (response) {
                // error callback
            });

        }

    }
</script>