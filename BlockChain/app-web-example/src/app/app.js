import angular from 'angular';
import ngTouch from 'angular-touch';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';

// 日期插件
import 'angularjs-datepicker';
import '../assets/style/global/angular-datepicker.css';
// import '../../node_modules/angularjs-datepicker/src/css/angular-datepicker.css';

// 汉化
import './core//i18n/i18n';

import services from './core/services';
import routers from './core/routers';
import factory from './core/factory';
// import Constant from './constant';
// import Utils from './utils';

// import Mustache from 'mustache';

var app = angular.module('app', [
    ngTouch,
    ngSanitize,
    uiRouter,
    services,
    routers,
    factory,
    '720kb.datepicker'
]).run(['$rootScope', '$state', function ($rootScope, $state) {
    /*    $rootScope.$watch(function () {
          // dynamic calcuate table height
            return  window.innerHeight;

        }, function (newVal, oldVal) {

            if (document && document.getElementById('mainRightCurrent')) {
                document.getElementById('mainRightCurrent').style.height = (newVal - 146) + 'px';
            }

            console.log('newVal', newVal);
            console.log('oldVal', oldVal);
        });  */
    $rootScope.pageLoaded = true;
    $rootScope.$on('$stateChangeSuccess', function (event, routeData) {
        /*        $rootScope.$watch(function () {
                    // dynamic calcuate table height
                    return window.innerHeight;

                }, function (newVal) {

                    if (document && document.getElementById('mainRightCurrent')) {
                        document.getElementById('mainRightCurrent').style.height = (newVal - 146) + 'px';
                    }

                    if (document && document.getElementById('allTypeLoanTag')) {
                        document.getElementById('allTypeLoanTag').style.height = (newVal - 146 - 160 - 65 - 170 + 65) + 'px';
                    }
                    if (document && document.getElementById('allTypeLoanNullTag')) {
                        document.getElementById('allTypeLoanNullTag').style.height = (newVal - 146 - 160 - 65 - 170 + 65) + 'px';
                    }

                    if (document && document.getElementById('commitedLoanTag')) {
                        document.getElementById('commitedLoanTag').style.height = (newVal - 146 - 160 - 65 - 170 + 70) + 'px';
                    }
                    if (document && document.getElementById('commitedLoanNullTag')) {
                        document.getElementById('commitedLoanNullTag').style.height = (newVal - 146 - 160 - 65 - 170 + 70) + 'px';
                    }

                    if (document && document.getElementById('notCommitLoanTag')) {
                        document.getElementById('notCommitLoanTag').style.height = (newVal - 146 - 160 - 65 - 170 + 70) + 'px';
                    }
                    if (document && document.getElementById('notCommitLoanNullTag')) {
                        document.getElementById('notCommitLoanNullTag').style.height = (newVal - 146 - 160 - 65 - 170 + 65) + 'px';
                    }

                    if (document && document.getElementById('signLoanTag')) {
                        document.getElementById('signLoanTag').style.height = (newVal - 146 - 160 - 65 - 170 + 70) + 'px';
                    }
                    if (document && document.getElementById('signLoanNullTag')) {
                        document.getElementById('signLoanNullTag').style.height = (newVal - 146 - 160 - 65 - 170 + 70) + 'px';
                    }

                });*/

        if (routeData.url === '/loanMgm') {
            $state.go('app.loanMgm.allTypeLoan');
        }
    });
}]);

// function renderHTML(statusCode) {

//     var errorElement = document.getElementById('page-bootstrap');
//     var template, style;

//     if (statusCode === 404 || statusCode === 403) {
//         template = require('./pages/403/403.html');
//         style = require('./pages/403/403.scss');
//     } else {
//         template = require('./pages/500/500.html');
//         style = require('./pages/500/500.scss');
//     }

//     errorElement.innerHTML = Mustache.render(template, { style });
// }
app.bootstrap = function () {

    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $http.defaults.useXDomain = true;
    $http.defaults.withCredentials = true;
    // return $http({
    //     method: 'GET',
    //     url: `${Constant.apiBase}/uniauth/currentUserInfo`
    // }).then(function (response) {
    //     var uniauth = Utils.extractUnithAuthURL(response);

    //     if (uniauth && uniauth.isUniauth && uniauth.url) {
    //         window.location = uniauth.url;
    //         return;
    //     }

    //     var data = response.data;

    //     if (data && data.content && data.content.email) {
    //         app.constant('UserInfo', data.content);
    //         angular.element(window.document).ready(function () {
    //             angular.bootstrap(window.document, [app.name]);
    //         });
    //         return;
    //     }

    //     console.log('Cannot get user profile');

    // }, function (error) {
    //     renderHTML(error.status);
    // });

    angular.element(window.document).ready(function () {
        angular.bootstrap(window.document, [app.name]);
    });

};

export default app;
