'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.redacted';

var request = require('request');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'GetCurrentMapsIntent': function () {
        request({
            url: 'http://splatoon.ink/schedule.json',
            json: true
        }, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                this.emit(':tell', `The current maps are ${body.schedule[0].regular.maps[0].name.en} and ${body.schedule[0].regular.maps[1].name.en} for Turf Wars, and ${body.schedule[0].ranked.maps[0].name.en} and ${body.schedule[0].ranked.maps[1].name.en} for ${body.schedule[0].ranked.rules.en}.`);
            }
        });
    }
};
