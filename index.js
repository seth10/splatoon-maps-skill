'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.redacted';

var request = require('request');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    
    request({
        url: 'http://splatoon.ink/schedule.json',
        json: true
    }, function (error, response, body) {
        switch (event.request.intent.name) {
            case 'GetCurrentMapsIntent':
                alexa.emit(':tell', `The current maps are ${body.schedule[0].regular.maps[0].name.en} and ${body.schedule[0].regular.maps[1].name.en} for Turf Wars, and ${body.schedule[0].ranked.maps[0].name.en} and ${body.schedule[0].ranked.maps[1].name.en} for ${body.schedule[0].ranked.rules.en}.`);
                break;
            case 'GetCurrentRankedMapsIntent':
                alexa.emit(':tell', `The current ${body.schedule[0].ranked.rules.en} maps are ${body.schedule[0].ranked.maps[0].name.en} and ${body.schedule[0].ranked.maps[1].name.en}.`);
                break;
            case 'GetCurrentTurfWarMapsIntent':
                alexa.emit(':tell', `The current Turf Wars maps are ${body.schedule[0].regular.maps[0].name.en} and ${body.schedule[0].regular.maps[1].name.en}.`);
                break;
            case 'GetCurrentRankedModeIntent':
                alexa.emit(':tell', `The current ranked mode is ${body.schedule[0].ranked.rules.en}.`);
                break;
            
            case 'GetUpcomingMapsIntent':
                alexa.emit(':tell', `The next maps are ${body.schedule[1].regular.maps[0].name.en} and ${body.schedule[1].regular.maps[1].name.en} for Turf Wars, and ${body.schedule[1].ranked.maps[0].name.en} and ${body.schedule[1].ranked.maps[1].name.en} for ${body.schedule[1].ranked.rules.en}.`);
                break;
            case 'GetUpcomingRankedMapsIntent':
                alexa.emit(':tell', `The next ranked maps are ${body.schedule[1].ranked.rules.en} on ${body.schedule[1].ranked.maps[0].name.en} and ${body.schedule[1].ranked.maps[1].name.en}.`);
                break;
            case 'GetUpcomingTurfWarMapsIntent':
                alexa.emit(':tell', `The next Turf Wars maps ${body.schedule[1].regular.maps[0].name.en} and ${body.schedule[1].regular.maps[1].name.en}.`);
                break;
            case 'GetUpcomingRankedModeIntent':
                alexa.emit(':tell', `The next ranked mode is ${body.schedule[1].ranked.rules.en}.`);
                break;
            
            case 'GetRotationTimeIntent':
                alexa.emit(':tell', `The next map ends at ${new Date(body.schedule[0].endTime)}, in ${new Date() - new Date(body.schedule[0].endTime)}.`); // need to format
                break;
        }
    });
};
