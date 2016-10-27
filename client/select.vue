<template>
  <div class="container">
    <caption><strong>选择操作</strong></caption>
    <thead>
    </thead>
    <tbody>
    <div class="success">
      <div class="row" style="margin-top:10px">
        <div class="col-xs-6 col-sm-6 col-md-12">
            <input type="button" class="btn btn-lg btn-success btn-block" value="h5插件更新" @click="h5update" id="hide">
        </div>
      </div>
      <!--
      <div>
        <button class="btn btn-info" @click="h5update">h5更新</button>
      </div>
      <div>
        <button class="btn btn-info" @click="appUpdate">app更新</button>
      </div>
      -->
      <div class="row" style="margin-top:10px">
          <div class="col-xs-6 col-sm-6 col-md-12">
              <input type="button" class="btn btn-lg btn-success btn-block" value="app更新" @click="appUpdate" id="hide">
          </div>
      </div>
    </div>
    </tbody>
  </div>
</template>

<script>
    module.exports = {
        events: {
            "h5update-app": function () {
                var self = this;
                if (confirm("确定更新h5？")) {
                  self.$route.router.go('/appversion');
                }
            },
            "appUpdate-app": function () {
                var self = this;
                if (confirm("确定更新Apk？")) {
                  self.$route.router.go('/app_version');
                }
            }
        },
        methods: {
            h5update: function () {
              this.$dispatch("h5update-app");
            },
            appUpdate: function () {
              this.$dispatch("appUpdate-app");
            }
        }
    }
</script>
