 import 'babel-polyfill';
 import 'modernizr';
 import 'normalize.css';
// import global styles
 import './assets/style/global/global.scss';
// render incompatible browser screen
 import Incompatible from './app/pages/incompatible/Incompatible';

 var isIncompatible = Incompatible.check();

// bootstrap application
 if (!isIncompatible) {
     require.ensure([], function (require) {
         require('./app/app').default.bootstrap();
     });
 }
