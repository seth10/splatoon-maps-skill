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
        
        var schedule, timeAdjective;
        switch (event.request.intent.name) {
            case 'GetCurrentMapsIntent':
            case 'GetCurrentRankedMapsIntent':
            case 'GetCurrentTurfWarMapsIntent':
            case 'GetCurrentRankedModeIntent':
                schedule = body.schedule[0];
                timeAdjective = 'current';
                break;
            
            case 'GetUpcomingMapsIntent':
            case 'GetUpcomingRankedMapsIntent':
            case 'GetUpcomingTurfWarMapsIntent':
            case 'GetUpcomingRankedModeIntent':
                schedule = body.schedule[1];
                timeAdjective = 'next';
                break;
        }
        
        switch (event.request.intent.name) {
            case 'GetCurrentMapsIntent':
            case 'GetUpcomingMapsIntent':
                alexa.emit(':tell', `The ${timeAdjective} maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en} for Turf Wars, and ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en} for ${schedule.ranked.rules.en}.`);
                break;
            case 'GetCurrentRankedMapsIntent':
            case 'GetUpcomingRankedMapsIntent':
                //alexa.emit(':tell', `The ${timeAdjective} ${schedule.ranked.rules.en} maps are ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
                alexa.emit(':tell', `The ${timeAdjective} ranked maps are ${schedule.ranked.rules.en} on ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
                break;
            case 'GetCurrentTurfWarMapsIntent':
            case 'GetUpcomingTurfWarMapsIntent':
                alexa.emit(':tell', `The ${timeAdjective} Turf Wars maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en}.`);
                break;
            case 'GetCurrentRankedModeIntent':
            case 'GetUpcomingRankedModeIntent':
                alexa.emit(':tell', `The ${timeAdjective} ranked mode is ${schedule.ranked.rules.en}.`);
                break;
            
            case 'GetRotationTimeIntent':
                alexa.emit(':tell', `The next map ends at ${new Date(schedule.endTime)}, in ${new Date() - new Date(schedule.endTime)}.`); // need to format
                break;
        }
        
    }); // close request
}; // close exports.handler
