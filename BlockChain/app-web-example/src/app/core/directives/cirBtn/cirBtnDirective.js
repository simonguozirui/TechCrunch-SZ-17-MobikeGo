import template from './cirBtnDirective.html';
import style from './cirBtnDirective.scss';

export default {
    name: 'cirBtnDirective',
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
