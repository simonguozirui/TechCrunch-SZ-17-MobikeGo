import angular from 'angular';
import P5 from './p5.js';

if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports) {
    module.exports = 'angular-p5';
}

angular.module('angular-p5', [])
.factory('p5', [function () {
    return P5;
}])
.directive('p5', ['p5WrapperFactory', function (p5WrapperFactory) {
    return {
        restrict: 'EA',
        scope: {
            sketch: '@'
        },
        link: function (scope, element) {
            var wrapper = p5WrapperFactory();
      
            scope.$watch('sketch', function (sketch) {
                wrapper.init(sketch, element[0]);
            });
  
            scope.$on('$destroy', function () {
                wrapper.destroy();
            });
        }
    };
}])
.factory('p5WrapperFactory', ['$injector', 'p5', function ($injector, P) {
    var p5Wrapper = {
        init: function (sketch, node) {
            this.destroy();
  
            if (sketch) {
                if ($injector.has(sketch)) {
                    sketch = $injector.get(sketch);
                }
                this.instance = new P(sketch, node);
            }
        },
    
        destroy: function () {
            if (this.instance) {
                this.instance.remove();
                this.instance = null;
            }
        }
    };

    return function () {
        return Object.create(p5Wrapper);
    };
}]);
