'use strict';

var http = require('http');

var options = {
    host: '192.168.43.109',
    path: '/api/update-lock-status/',
    port: 8080,
    method: 'POST',
    headers: {
        'Content-Length': '1',
    }
};

function postState(state) {
    var req = http.request(options, function(res) {
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    req.write(state);
    req.end();
}

$.ready(function (error) {
    if (error) {
        console.log(error);
        return;
    }

    $('#CK002').on('push', function() {
        console.log('Locked');
        options.path = '/api/update-lock-status/1';
        postState('Locked');
        $('#led-r').turnOn();

        setTimeout(function(){
            $('#MH-FMG').turnOn();
        }, 400)
        setTimeout(function(){
            $('#MH-FMG').turnOff();
        }, 800)
        setTimeout(function(){
            $('#MH-FMG').turnOn();
        }, 1200)
         setTimeout(function(){
            $('#MH-FMG').turnOff();
        }, 1600)
        setTimeout(function(){
            $('#MH-FMG').turnOn();
        }, 2000)
        setTimeout(function(){
            $('#MH-FMG').turnOff();
        }, 2400)
        // $('#MH-FMG').buzz();
        // $('#MH-FMG').unbuzz();
    });

    $('#CK002').on('release', function() {
        console.log('Unlocked');
        options.path = '/api/update-lock-status/0';
        postState('Unlocked');
        $('#led-r').turnOff();

    });
});


$.end(function () {
    $('#led-r').turnOff();
    $('#MH-FMG').turnOff();
});