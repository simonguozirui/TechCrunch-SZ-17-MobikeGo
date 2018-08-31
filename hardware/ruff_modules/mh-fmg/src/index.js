/*
 * Copyright (c) 2015 Nanchao Inc. All rights reserved.
 */
'use strict';
var driver = require('ruff-driver');
var Gpio = require('gpio');

module.exports = driver({
    attach: function(inputs) {
        this._gpio = inputs.getRequired('gpio');
        this._gpio.setDirection(Gpio.OUT_LOW);
    },

    exports: {
        buzz: function() {
            return this._gpio.write(1);
        },

        turnOn: function() {
            return this._gpio.write(1);
        },

        unbuzz: function() {
            return this._gpio.write(0);
        },

        turnOff: function() {
            return this._gpio.write(0);
        },

        isOn: function() {
            return this._gpio.read() === 1;
        }
    }
});
