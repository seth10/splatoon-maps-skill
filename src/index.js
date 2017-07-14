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
        getSchedule(0, this.emit, function(emit, schedule) {
            emit(':tell', `The current maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en} for Turf Wars, and ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en} for ${schedule.ranked.rules.en}.`);
        });
    },
    'GetCurrentRankedMapsIntent': function() {
        getSchedule(0, this.emit, function(emit, schedule) {
            emit(':tell', `The current ${schedule.ranked.rules.en} maps are ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
        });
    },
    'GetCurrentTurfWarMapsIntent': function() {
        getSchedule(0, this.emit, function(emit, schedule) {
            emit(':tell', `The current Turf Wars maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en}.`);
        });
    },
    'GetCurrentRankedModeIntent': function() {
        getSchedule(0, this.emit, function(emit, schedule) {
            emit(':tell', `The current ranked mode is ${schedule.ranked.rules.en}.`);
        });
    },
    'GetUpcomingMapsIntent': function() {
        getSchedule(1, this.emit, function(emit, schedule) {
            emit(':tell', `The next maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en} for Turf Wars, and ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en} for ${schedule.ranked.rules.en}.`);
        });
    },
    'GetUpcomingRankedMapsIntent': function() {
        getSchedule(1, this.emit, function(emit, schedule) {
            emit(':tell', `The next ${schedule.ranked.rules.en} maps are ${schedule.ranked.maps[0].name.en} and ${schedule.ranked.maps[1].name.en}.`);
        });
    },
    'GetUpcomingTurfWarMapsIntent': function() {
        getSchedule(1, this.emit, function(emit, schedule) {
            emit(':tell', `The next Turf Wars maps are ${schedule.regular.maps[0].name.en} and ${schedule.regular.maps[1].name.en}.`);
        });
    },
    'GetUpcomingRankedModeIntent': getSchedule.bind(null, 1, this.emit, function(emit, schedule) {
            emit(':tell', `The next ranked mode is ${schedule.ranked.rules.en}.`);
        });
    },
    'GetUpcomingRankedModeIntent': getSchedule.bind(null, 1, this.emit,
                                                    emit.bind(':tell', `The next ranked mode is ${schedule.ranked.rules.en}.`)),
    'GetUpcomingRankedModeIntent': getSchedule.bind(null, 1, this.emit,
                                                    schedule => emit(':tell', `The next ranked mode is ${schedule.ranked.rules.en}.`)),
    'GetUpcomingRankedModeIntent': getSchedule.bind(this,
                                       schedule => emit(':tell', `The next ranked mode is ${schedule[1].ranked.rules.en}.`)),
    'GetRotationTimeIntent': function() {
        getSchedule(0, this.emit, function(emit, schedule) {
            var response = `The current maps ends at ${moment(schedule.endTime).utcOffset('-0500').format('h:mm a')}, in `;
            let hr = moment(schedule.endTime).diff(moment(), 'hours');
            let min = ${moment(schedule.endTime).diff(moment(), 'minutes') % 60;
            let hrText = (hr == 1 ? 'hour' : 'hours');
            let minText = (min == 1 ? 'minute' : 'minutes');
            if (hr > 0)
                response += `{hr} ${hrText}` + (min > 0 ? ' and ' : '.');
            if (min > 0) response += `${min} ${minText}.`;
            if (hr == 0 && min == 0) response = 'The current maps end in less than one minute.';
            emit(':tell', response);
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

function getSchedule(which, emit, callback) {
    request({
        url: 'http://splatoon.ink/schedule.json',
        json: true
    }, function (error, response, body) {
        callback(emit, body.schedule[which]);
    });
}
function getSchedule(callback) {
    request(
        { url: 'http://splatoon.ink/schedule.json',
          json: true },
        (error, response, body) => callback(body.schedule);
    );
}
