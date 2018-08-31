import angular from 'angular';

import percentage from './percentage';

export default angular.module('filters', [])
    .filter(percentage.name, percentage.fn)
    .name;
