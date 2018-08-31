import angular from 'angular';
import ngResource from 'angular-resource';

import InterceptorSvc from './interceptorSvc';
import LatestSvc from './latestSvc';
import InitLoadBlocksSvc from './initLoadBlocksSvc';
import NodeNumberSvc from './nodeNumberSvc';
import RentalQuerySvc from './rentalQuerySvc';
import RentalInvokeSvc from './rentalInvokeSvc';

export default angular.module('services', [ngResource])
    .factory(InterceptorSvc.name, InterceptorSvc.fn)
    .factory(LatestSvc.name, LatestSvc.fn)
    .factory(InitLoadBlocksSvc.name, InitLoadBlocksSvc.fn)
    .factory(NodeNumberSvc.name, NodeNumberSvc.fn)
    .factory(RentalQuerySvc.name, RentalQuerySvc.fn)
    .factory(RentalInvokeSvc.name, RentalInvokeSvc.fn)
    .name;
