import angular from 'angular';
import transactionDetailDirective from './transactionDetail/transactionDetailDirective';
import cirBtnDirective from './cirBtn/cirBtnDirective';
import detailTitleDirective from './detailTitle/detailTitleDirective';

export default angular.module('directives', [])
    .directive(transactionDetailDirective.name, transactionDetailDirective.fn)
    .directive(cirBtnDirective.name, cirBtnDirective.fn)
    .directive(detailTitleDirective.name, detailTitleDirective.fn)
    .name;
