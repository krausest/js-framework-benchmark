import { default as jQuery } from 'jquery';
import { default as angular } from 'angular';
import { HomeController } from './home.controller';

angular
    .module('app', [])
    .config(['$compileProvider', function ($compileProvider) {
        $compileProvider.debugInfoEnabled(false);
    }])
    .run(() => {
        console.info(angular.version.full);
    })
    .controller('HomeController', HomeController);