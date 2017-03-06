'use strict';
let Alexa = require('alexa-sdk');
let APP_ID = 'amzn1.ask.skill.9c866a0b-211f-4899-a3ac-5ef0310dc725';

let request = require('request');
let moment = require('moment');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function() {
        this.emit('GetCurrentMapsIntent');
    },
    'GetCurrentMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The current maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en} for Turf Wars, and ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en} for ${schedule.ranked.rules.en}.`);
        });
    },
    'GetCurrentRankedMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The current ${schedule.ranked.rules.en} maps are ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
        });
    },
    'GetCurrentTurfWarMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The current Turf Wars maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en}.`);
        });
    },
    'GetCurrentRankedModeIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The current ranked mode is ${schedule.ranked.rules.en}.`);
        });
    },
    'GetUpcomingMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The next maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en} for Turf Wars, and ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en} for ${schedule.ranked.rules.en}.`);
        });
    },
    'GetUpcomingRankedMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The next ${schedule.ranked.rules.en} maps are ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
        });
    },
    'GetUpcomingTurfWarMapsIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The next Turf Wars maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en}.`);
        });
    },
    'GetUpcomingRankedModeIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            emit(':tell', `The next ranked mode is ${schedule.ranked.rules.en}.`);
        });
    },
    'GetRotationTimeIntent': function() {
        handleSplatterIntents(this.emit, function(emit, schedule) {
            if (moment(schedule.endTime).diff(moment(), 'hours') > 0)
                emit(':tell', `The current maps ends at ${moment(schedule.endTime).format('h:mm a')}, in ${moment(schedule.endTime).diff(moment(), 'hours')} hours and ${moment(schedule.endTime).diff(moment(), 'minutes') % 60} minutes.`);
            else
                emit(':tell', `The current maps ends at ${moment(schedule.endTime).format('h:mm a')}, in ${moment(schedule.endTime).diff(moment(), 'minutes') % 60} minutes.`);
        });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':tell', 'You can say: what are the current maps?');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Stay fresh!');
    }
};
    
function handleSplatterIntents(emit, callback) {
    request({
        url: 'http://splatoon.ink/schedule.json',
        json: true
    }, function (error, response, body) {
        callback(emit, body.schedule[0]);
    });
}
