'use strict';

import request from 'request-promise';
import Alexa from 'ask-sdk';
import moment from 'moment';

const COMMON_REPROMPT = "I didn't catch that. What can I help you with?";

async function getSchedule() {
  try {
    const response = await request({
        url: 'http://splatoon.ink/schedule2.json',
        json: true
    });
    return response;
  } catch (error) {
    return "Caught error";
  }
}


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('IN: LaunchRequestHandler.handle');

    return handlerInput.responseBuilder
      .speak('Welcome to Splatter. What can I help you with?')
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End LaunchRequestHandler

const CancelHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.CancelIntent';
  },
  handle(handlerInput) {
    console.log('IN: CancelHandler.handle');

    return handlerInput.responseBuilder
      .speak('Have a great day!')
      .reprompt('COMMON_REPROMPT')
      .getResponse();
  },
}; // End CancelHandler

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    console.log('IN: HelpHandler.handle');

    return handlerInput.responseBuilder
      .speak('To hear a the schedule, you could say, \'What maps are on?\' or you can ask' +
        ' for a specific game mode, for example, say \'What ranked maps are on?\'. ' +
        ' To know when the current maps will end, say, \'When do the maps rotate?\'.' +
        ' So, what can I help you with?')
      .reprompt('COMMON_REPROMPT')
      .getResponse();
  },
}; // End HelpHandler

const NoHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.NoIntent';
  },
  handle(handlerInput) {
    console.log('IN: NoHandler.handle');

    return handlerInput.responseBuilder
      .speak('Have a great day!')
      .getResponse();
  },
}; // End NoHandler

const StopHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
  },
  handle(handlerInput) {
    console.log('IN: StopHandler.handle');

    return handlerInput.responseBuilder
      .speak('OK.')
      .getResponse();
  },
}; // End StopHandler


const GetCurrentMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetCurrentMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetCurrentMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The current maps are ${schedule.modes.regular[0].maps[0]} and ${schedule.modes.regular[0].maps[1]} for Turf Wars, and ${schedule.modes.gachi[0].maps[0]} and ${schedule.modes.gachi[0].maps[1]} for ${schedule.modes.gachi[0].rule.name}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetCurrentMapsHandler

const GetCurrentRankedMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetCurrentRankedMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetCurrentRankedMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The current ${schedule.modes.gachi[0].rule.name} maps are ${schedule.modes.gachi[0].maps[0]} and ${schedule.modes.gachi[0].maps[1]}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetCurrentRankedMapsHandler

const GetCurrentTurfWarMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetCurrentTurfWarMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetCurrentTurfWarMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The current Turf Wars maps are ${schedule.modes.regular[0].maps[0]} and ${schedule.modes.regular[0].maps[1]}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetCurrentTurfWarMapsHandler

const GetCurrentRankedModeHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetCurrentRankedModeIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetCurrentRankedModeHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The current ranked mode is ${schedule.modes.gachi[0].rule.name}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetCurrentRankedModeHandler

const GetUpcomingMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetUpcomingMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetUpcomingMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The next maps are ${schedule.modes.regular[1].maps[0]} and ${schedule.modes.regular[1].maps[1]} for Turf Wars, and ${schedule.modes.gachi[1].maps[0]} and ${schedule.modes.gachi[1].maps[1]} for ${schedule.modes.gachi[1].rule.name}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetUpcomingMapsHandler

const GetUpcomingRankedMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetUpcomingRankedMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetUpcomingRankedMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The next ${schedule.modes.gachi[1].rule.name} maps are ${schedule.modes.gachi[1].maps[0]} and ${schedule.modes.gachi[1].maps[1]}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetUpcomingRankedMapsHandler

const GetUpcomingTurfWarMapsHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetUpcomingTurfWarMapsIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetUpcomingTurfWarMapsHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The next Turf Wars maps are ${schedule.modes.regular[1].maps[0]} and ${schedule.modes.regular[1].maps[0]}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetUpcomingTurfWarMapsHandler

const GetUpcomingRankedModeHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetUpcomingRankedModeIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetUpcomingRankedModeHandler.handle');

    let schedule = await getSchedule();

    return handlerInput.responseBuilder
      .speak(`The next ranked mode is ${schedule.modes.gachi[1].rule.name}.`)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetUpcomingRankedModeHandler

const GetRotationTimeHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'GetRotationTimeIntent';
  },
  async handle(handlerInput) {
    console.log('IN: GetRotationTimeHandler.handle');

    let schedule = await getSchedule();
    
    const endTime = moment(schedule.modes.regular[0].endTime*1000);
    let response = `The current maps end in `;
    const hr = endTime.diff(moment(), 'hours');
    const min = endTime.diff(moment(), 'minutes') % 60;
    const hrText = (hr == 1 ? 'hour' : 'hours');
    const minText = (min == 1 ? 'minute' : 'minutes');
    if (hr > 0) {
        response += `${hr} ${hrText}` + (min > 0 ? ' and ' : '.');
    }
    if (min > 0) {
      response += `${min} ${minText}.`;
    }
    if (hr == 0 && min == 0) {
      response = 'The current maps end in less than one minute. Now or Never!';
    }

    return handlerInput.responseBuilder
      .speak(response)
      .reprompt(COMMON_REPROMPT)
      .getResponse();
  },
}; // End GetRotationTimeHandler


export const handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    CancelHandler,
    HelpHandler,
    NoHandler,
    StopHandler,
    GetCurrentMapsHandler,
    GetCurrentRankedMapsHandler,
    GetCurrentTurfWarMapsHandler,
    GetCurrentRankedModeHandler,
    GetUpcomingMapsHandler,
    GetUpcomingRankedMapsHandler,
    GetUpcomingTurfWarMapsHandler,
    GetUpcomingRankedModeHandler,
    GetRotationTimeHandler
  )
  .lambda();
