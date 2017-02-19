'use strict';
let Alexa = require('alexa-sdk');
let APP_ID = 'amzn1.ask.skill.redacted';

let request = require('request');
let moment = require('moment');

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
            case 'GetRotationTimeIntent':
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
                // time difference should never be over 4 hours
                
                // most simple, but only says in 3, 2, or 1 hours, or n minutes if less than an hour left (NOT both like "in h hours and mm minutes")
                //alexa.emit(':tell', `The current maps ends at ${moment(schedule.endTime).format('h:mm a')}, ${moment(schedule.endTime).fromNow()}.`);
            
                // complete and works, I feel like it should be simpler than this though
                if (moment(schedule.endTime).diff(moment(), 'hours') > 0)
                    alexa.emit(':tell', `The current maps ends at ${moment.utc(schedule.endTime).local().utcOffset(-5*60).format('h:mm a')}, in ${moment(schedule.endTime).diff(moment(), 'hours')} hours and ${moment(schedule.endTime).diff(moment(), 'minutes') % 60} minutes.`);
                else
                    alexa.emit(':tell', `The current maps ends at ${moment.utc(schedule.endTime).local().utcOffset(-5*60).format('h:mm a')}, in ${moment(schedule.endTime).diff(moment(), 'minutes') % 60} minutes.`);
                
                break;
        }
        
    }); // close request
}; // close exports.handler
