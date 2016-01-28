<style>
    /* Credit to bootsnipp.com for the css for the color graph */
    .colorgraph {
        height: 5px;
        border-top: 0;
        background: #c4e17f;
        border-radius: 5px;
        background-image: -webkit-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
        background-image: -moz-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
        background-image: -o-linear-gradient(left, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
        background-image: linear-gradient(to right, #c4e17f, #c4e17f 12.5%, #f7fdca 12.5%, #f7fdca 25%, #fecf71 25%, #fecf71 37.5%, #f0776c 37.5%, #f0776c 50%, #db9dbe 50%, #db9dbe 62.5%, #c49cde 62.5%, #c49cde 75%, #669ae1 75%, #669ae1 87.5%, #62c2e4 87.5%, #62c2e4);
    }
</style>

<template>
    <div class="container">

        <div class="row" style="margin-top:20px">
            <div class="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
                <!--<form role="form"  method="post" action="/" >-->
                <fieldset>
                    <h2>Please Sign In</h2>
                    <hr class="colorgraph">
                    <!--<div class="form-group">-->
                    <!--<input type="username" name="username" id="username" class="form-control input-lg"-->
                    <!--placeholder="Email Address">-->
                    <!--</div>-->
                    <div class="form-group">
                        <input type="username" name="username" id="username" class="form-control input-lg"
                               value="qxl1231"
                               placeholder="username ">
                    </div>
                    <div class="form-group">
                        <input type="password" name="password" id="password" class="form-control input-lg"
                               placeholder="Password" value="1231">
                    </div>
                    <!--<span class="button-checkbox">-->
                    <!--<button type="button" class="btn" data-color="info">Remember Me</button>-->
                    <!--<input type="checkbox" name="remember_me" id="remember_me" checked="checked" class="hidden">-->
                    <!--<a href="" class="btn btn-link pull-right">Forgot Password?</a>-->
                    <!--</span>-->
                    <hr class="colorgraph">
                    <div class="row">
                        <div class="col-xs-6 col-sm-6 col-md-12">
                            <input type="button" class="btn btn-lg btn-success btn-block" value="登录" @click="login"
                                   id="hide">
                        </div>

                        <!--<div class="col-xs-6 col-sm-6 col-md-6">-->
                        <!--<a href="" class="btn btn-lg btn-primary btn-block">Register</a>-->
                        <!--</div>-->
                    </div>

                    <div class="alert alert-warning" style="display: none">
                        <strong>Warning!</strong> 您的用户名或密码不正确!请重新输入.
                    </div>

                </fieldset>
                <!--</form>-->
            </div>
        </div>

    </div>
</template>

<script>
    $(function () {
        $('.button-checkbox').each(function () {
            var $widget = $(this),
                    $button = $widget.find('button'),
                    $checkbox = $widget.find('input:checkbox'),
                    color = $button.data('color'),
                    settings = {
                        on: {
                            icon: 'glyphicon glyphicon-check'
                        },
                        off: {
                            icon: 'glyphicon glyphicon-unchecked'
                        }
                    };

            $button.on('click', function () {
                $checkbox.prop('checked', !$checkbox.is(':checked'));
                $checkbox.triggerHandler('change');
                updateDisplay();
            });

            $checkbox.on('change', function () {
                updateDisplay();
            });

            function updateDisplay() {
                var isChecked = $checkbox.is(':checked');
                // Set the button's state
                $button.data('state', (isChecked) ? "on" : "off");

                // Set the button's icon
                $button.find('.state-icon')
                        .removeClass()
                        .addClass('state-icon ' + settings[$button.data('state')].icon);

                // Update the button's color
                if (isChecked) {
                    $button
                            .removeClass('btn-default')
                            .addClass('btn-' + color + ' active');
                }
                else {
                    $button
                            .removeClass('btn-' + color + ' active')
                            .addClass('btn-default');
                }
            }

            function init() {
                updateDisplay();
                // Inject the icon if applicable
                if ($button.find('.state-icon').length == 0) {
                    $button.prepend('<i class="state-icon ' + settings[$button.data('state')].icon + '"></i> ');
                }
            }

            init();
        });
    });


    module.exports = {

        http: {
            root: '/api'
        },
        data: function () {
            return {
                user: {
                    usename: "",
                    email: "",
                    pwd: ""
                }
            }
        },
        methods: {
            login: function () {
                var username = $('#username').val();
                var password = $('#password').val();
//                console.log(username + password)

                var settings = {
                    "async": true,
                    "crossDomain": true,
                    "url": "/api/Users/login",
                    "method": "POST",
                    "headers": {
                        "content-type": "application/json",
                        "accept": "application/json",
                        "cache-control": "no-cache",
                        "postman-token": "e5edd675-b902-7711-eba4-2cbab9bc227f"
                    },
                    "processData": false,
                    "data": "{\"username\":\"" + username + "\", \"password\":\"" + password + "\"}"
                }

                $.ajax(settings).done(function (response) {
                    self.user = response;
                    if (response && response.userId) {
                        $("fieldset").hide();
                        $(".table").show();
                        $("#selectid").show();

                        $("button").show();

                    }

                }).error(function (err) {
                    $("fieldset").show();
                     $(".alert").show();
                });
            }
        }
    }

</script>