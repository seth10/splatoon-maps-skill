'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.redacted';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'GetCurrentMapsIntent': function () {
        this.emit(':tell', 'The current maps are...')
    }
};
