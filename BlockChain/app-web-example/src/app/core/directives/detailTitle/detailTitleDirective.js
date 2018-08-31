import template from './detailTitleDirective.html';
import style from './detailTitleDirective.scss';

export default {
    name: 'detailTitleDirective',
    fn: [function () {
        return {
            restrict: 'AEC',
            template: template,
            link: function (scope, element) {
                element;
                scope.style = style;
            }
        };
    }]
};
