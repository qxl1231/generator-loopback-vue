<template>
    <div class="container">
        <form role="form"  id="selectid"><strong>请选择appID:</strong>
            <div class="form-group">
                <select v-model="value" @change="changeFuncApp(value)" class="form-control">
                    <!--<option value="1">1</option>-->
                    <option v-for="mapp in myapp" v-bind:value="mapp.id">{{mapp.id}}</option>
                </select>
                <!--<span>Selected: {{ value }}</span>-->
            </div>
        </form>
        <table class="table" >
            <caption><strong>APK下版本号</strong></caption>
            <thead>
            <tr>
                <th>id</th>
                <th>verCode</th>
                <th>apkPath</th>
                <th>releaseNotes</th>
                <th class="col-2">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr class="success">
                <td><input v-model="editing.id" placeholder="可以不填"/></td>
                <td><input v-model="editing.verCode" placeholder="必须填写"/></td>
                <td><input v-model="editing.apkPath" placeholder="APK下载地址"/></td>
                <td><input v-model="editing.releaseNotes" placeholder="可以不填，更新说明"/></td>
                <td>
                    <button class="btn btn-info" @click="addApp" >添加</button>
                </td>
            </tr>
            <tr class="info" v-for="app in apps">
                <td><input v-model="app.id" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.verCode" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.apkPath" @keyup="updateApp(app) | debounce 500"/></td>
                <td><input v-model="app.releaseNotes" @keyup="updateApp(app) | debounce 500"/></td>
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
            root: '/api/v1'
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
                    verCode: "",
                    apkPath: "",
                    releaseNotes: "",
                    appId: ""
                }
            }
        },
        methods: {
            addApp: function () {
                var self = this;
                var verCode = self.editing.verCode;
                console.log(verCode);
                var apkPath = self.editing.apkPath;
                var releaseNotes = self.editing.releaseNotes;
                if (verCode) {
                    apps.save({}, {
                        verCode: verCode,
                        apkPath: apkPath,
                        releaseNotes: releaseNotes
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
            changeFuncApp: function (value) {
                var self = this;
                var access_token = localStorage.getItem('access_token');
                console.log(access_token);
                // GET request
                var httpurl = '/api/v1/apps?access_token=' + access_token;
                self.$http({url: httpurl, method: 'GET'}).then(function (response) {
                    // success callback
                    if (response.data&&response.data[0]!=undefined) {
                        self.myapp = response.data;
                    }
                }, function (response) {
                    // error callback
                });
                var access_token = localStorage.getItem('access_token');
                var resurl = 'apps/' + value + '/appversions/:id?access_token=' + access_token;
                console.log('resurl : ' + resurl);
                apps = self.$resource(resurl);
                this.fetchApps();
            }
        },
        ready: function () {
            var self = this;
            var access_token = localStorage.getItem('access_token');
            console.log(access_token);

            // GET request
            var httpurl = '/api/v1/apps?access_token=' + access_token;
            self.$http({url: httpurl, method: 'GET'}).then(function (response) {
                // success callback
                if (response.data&&response.data[0]!=undefined) {
                    self.myapp = response.data;
                    console.log(self.myapp[0]);
                    console.log(JSON.stringify(self.myapp[0]));
                    self.changeFuncApp(self.myapp[0].id);
                }

            }, function (response) {
                // error callback
            });
        }
    }
</script>
