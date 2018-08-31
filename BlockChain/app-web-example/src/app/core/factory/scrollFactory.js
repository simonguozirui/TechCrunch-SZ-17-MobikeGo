export default {
    name: 'scrollFactory',
    fn: ['$rootScope', '$interval', '$timeout',  function ($rootScope, $interval, $timeout) {
        return {
            scrollTop: function (callback) {
                let h = document.body.scrollTop;

                if (callback) {
                    callback();
                }

                function timeout() {
                    $timeout(function () {
                        if (h > 0) {
                            h -= 5;
                            document.body.scrollTop = h;
                            // 滚动时阻止滚轮事件
                            document.body.onmousewheel = function (event) {
                                event = event || window.event;
                                event.preventDefault;
                                event.stopPropagagtion;
                            };
                            timeout();
                        }
                    }, 2);
                }
                timeout();
                
            },
            scrollDown: function (callback) {
                let h = document.body.scrollTop;

                if (callback) {
                    callback();
                }

                function timeout() {
                    $timeout(function () {
                        if (h <= window.innerHeight) {
                            h += 5;
                            document.body.scrollTop = h;
                            // 滚动时阻止滚轮事件
                            document.body.onmousewheel = function (event) {
                                event = event || window.event;
                                event.preventDefault;
                                event.stopPropagagtion;
                            };
                            timeout();
                        }
                    }, 2);
                }
                timeout();
            },
            listenScrollTop: function () {
                // 监听滚动条高度
                $rootScope.isShowBtn = false;
                $rootScope.isShowBtnInterval = $interval(function () {
                    if (document.body.scrollTop > window.innerHeight / 2) {
                        $rootScope.isShowBtn = true;
                    } else {
                        $rootScope.isShowBtn = false;          
                    }
                }, 1000);
            }
        };
    }]
};
