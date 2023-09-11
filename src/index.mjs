import request from 'request-promise';
import Alexa from 'ask-sdk';

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    console.log('IN: LaunchRequestHandler.handle');

    return handlerInput.responseBuilder
      .speak('Welcome to Splatter. What can I help you with?')
      .reprompt('I didn\'t catch that. What can I help you with?')
      .getResponse();
  },
}; // End LaunchRequestHandler

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
      .reprompt('I didn\'t catch that. What can I help you with?')
      .getResponse();
  },
}; // End GetCurrentMapsHandler

export const handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    GetCurrentMapsHandler
  )
  .lambda();


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
