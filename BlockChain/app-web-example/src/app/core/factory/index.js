import angular from 'angular';
import ngResource from 'angular-resource';

import pointLineFactory from './pointLineFactory';
import httpFactory from './httpFactory';

export default angular.module('factory', [ngResource])
    .factory(pointLineFactory.name, pointLineFactory.fn)
    .factory(httpFactory.name, httpFactory.fn)
    .name;
