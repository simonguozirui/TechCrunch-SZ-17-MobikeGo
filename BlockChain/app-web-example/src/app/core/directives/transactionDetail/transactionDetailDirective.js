import template from './transactionDetailDirective.html';
import style from './transactionDetailDirective.scss';

export default {
    name: 'transactionDetailDirective',
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
