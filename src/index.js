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
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The current maps are ${schedule.modes.regular[0].maps[0]} and ${schedule.modes.regular[0].maps[1]} for Turf Wars, and ${schedule.modes.gachi[0].maps[0]} and ${schedule.modes.gachi[0].maps[1]} for ${schedule.modes.gachi[0].rule.name}.`);
        });
    },
    'GetCurrentRankedMapsIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The current ${schedule.modes.gachi[0].rule.name} maps are ${schedule.modes.gachi[0].maps[0]} and ${schedule.modes.gachi[0].maps[1]}.`);
        });
    },
    'GetCurrentTurfWarMapsIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The current Turf Wars maps are ${schedule.modes.regular[0].maps[0]} and ${schedule.modes.regular[0].maps[1]}.`);
        });
    },
    'GetCurrentRankedModeIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The current ranked mode is ${schedule.modes.gachi[0].rule.name}.`);
        });
    },
    'GetUpcomingMapsIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The next maps are ${schedule.modes.regular[1].maps[0]} and ${schedule.modes.regular[1].maps[1]} for Turf Wars, and ${schedule.modes.gachi[1].maps[0]} and ${schedule.modes.gachi[1].maps[1]} for ${schedule.modes.gachi[1].rule.name}.`);
        });
    },
    'GetUpcomingRankedMapsIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The next ${schedule.modes.gachi[1].rule.name} maps are ${schedule.modes.gachi[1].maps[0]} and ${schedule.modes.gachi[1].maps[1]}.`);
        });
    },
    'GetUpcomingTurfWarMapsIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The next Turf Wars maps are ${schedule.modes.regular[1].maps[0]} and ${schedule.modes.regular[1].maps[0]}.`);
        });
    },
    'GetUpcomingRankedModeIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            emit(':tell', `The next ranked mode is ${schedule.modes.gachi[1].rule.name}.`);
        });
    },
    'GetRotationTimeIntent': function() {
        getSchedule(this.emit, function(emit, schedule) {
            let endTime = moment(schedule.modes.regular[0].endTime*1000);
            var response = `The current maps ends at ${endTime.utcOffset('-0500').format('h:mm a')}, in `;
            let hr = endTime.diff(moment(), 'hours');
            let min = endTime.diff(moment(), 'minutes') % 60;
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
        this.emit(':tell', 'You can say: alexa, ask the squid sisters what are the current maps.');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Stay fresh! <audio src="https://s3.amazonaws.com/splatter/Woomy.mp3" />');
    }
};

function getSchedule(emit, callback) {
    request({
        url: 'http://splatoon.ink/schedule2.json',
        json: true
    }, function (error, response, body) {
        callback(emit, body);
    });
}
