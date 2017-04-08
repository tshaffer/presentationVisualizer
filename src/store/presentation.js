// @flow

import path from 'path';
import fs from 'fs';

const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const clone = require('clone');

import {
  dmOpenSign,
  dmGetSignMetaData,
  dmGetZonesForSign,
  dmGetZoneById,
  dmGetMediaStateById,
  dmGetZoneSimplePlaylist,
  dmGetEventIdsForMediaState,
  dmGetTransitionIdsForEvent,
  dmGetTransitionById,
  ContentItemType,
  VideoModeName,
  TransitionTypeName,
  EventTypeName,
  dmGetEventById,
  ZoneTypeCompactName,
  ViewModeTypeName,
  ImageModeTypeName,
  AudioOutputSelectionSpecName,
  AudioModeSpecName,
  AudioMappingTypeName,
  AudioOutputTypeName,
  AudioMixModeTypeName,
  LiveVideoInputTypeName,
  LiveVideoStandardTypeName,
  dmUpdateSignProperties,
  dmGetSignState,
} from '@brightsign/bsdatamodel';

import {
  buildTextPresentationItem,
  buildSelectFieldPresentationItem,
  buildCheckboxPresentationItem
} from '../entities/presentationItem';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_AUTOPLAY = 'SET_AUTOPLAY';


// ------------------------------------
// Actions
// ------------------------------------
export function setAutoplay(autoplay : Object){

  return {
    type: SET_AUTOPLAY,
    payload: autoplay
  };
}


// ------------------------------------
// Action Creators
// ------------------------------------
export function openPresentation(path : string) {
  return (dispatch : Function, getState : Function) => {
    getFile(path).then( (autoPlay) => {
      dispatch(dmOpenSign(autoPlay));
      const state = getState();
      const autoplay = generateAutoplay(state.bsdm);
      dispatch(setAutoplay(autoplay));
    });
  };
}

export function savePresentation(path : string) {

  let state = null;

  return (dispatch: Function, getState: Function) => {

    // copy updated parameters from presentation to bsdm
    state = getState();
    const signParams = getSignParams(state.presentation.autoplay.BrightAuthor.meta);
    dispatch(dmUpdateSignProperties(signParams));

    // get updated bsdm and write to file
    state = getState();
    const presentation = dmGetSignState(state.bsdm);
    const bpfStr = JSON.stringify(presentation, null, '\t');
    fs.writeFileSync(path, bpfStr);
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  autoplay : {},
};

export default function(state : Object = initialState, action : Object) {

  switch (action.type) {

    case SET_AUTOPLAY: {

      let newState = {
        ...state,
        autoplay: action.payload
      };

      console.log(newState);
      return newState;
    }
  }

  return state;
}


// ------------------------------------
// Utilities
// ------------------------------------
const getFile = (filePath = '') => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, dataBuffer) => {
      if (err) {
        reject(err);
      } else {
        const fileStr : string = decoder.write(dataBuffer);
        const file : Object = JSON.parse(fileStr);
        resolve(file);
      }
    });
  });
};

function generateAutoplay(bsdm): Object {

  let autorunAutoplay = {};
  autorunAutoplay.BrightAuthor = getBrightAuthorMetadata();

  let autorunSign = autorunAutoplay.BrightAuthor;
  autorunSign.meta = getSignMetadata(bsdm);
  autorunSign.zones = [];

  const zoneIds = dmGetZonesForSign(bsdm);
  zoneIds.forEach( (zoneId) => {

    let autorunZone = getZoneMetadata(bsdm, zoneId);

    // TODO - do we still need to have the playlist as an object, or should its parameters move to zone?
    let autorunPlaylist = getPlaylistMetadata(bsdm, autorunZone);

    getMediaStates(bsdm, zoneId, autorunPlaylist);

    autorunZone.playlist = autorunPlaylist;

    autorunSign.zones.push(autorunZone);
  });

  return autorunAutoplay;
}

function getBrightAuthorMetadata() {

  let BrightAuthor = {};
  BrightAuthor.version = 6;
  BrightAuthor.BrightAuthorVersion = '5.0.0.0';
  BrightAuthor.type = 'publish';

  return BrightAuthor;
}

function getSignMetadata(bsdm) {

  const bsdmSignMetadata = dmGetSignMetaData(bsdm);

  let appSignMetadata = clone(bsdmSignMetadata);

  // TODO
  appSignMetadata.videoMode = buildTextPresentationItem('videoMode', VideoModeName(bsdmSignMetadata.videoMode),
    ['meta', 'videoMode']);

  appSignMetadata.model = buildSelectFieldPresentationItem('model', bsdmSignMetadata.model, ['meta', 'model'],
    ['HD1023', 'HS123', 'HD223', 'LS423',
      'XD1033', 'XD233',
      'XT1143', 'XT243',
      'HD1022', 'HD222',
      'XD1132', 'XD1032', 'XD232',
      'FK1142', 'FK1042', 'FK242',
      'HD1020', 'HD220', 'HD120', 'LS422', 'LS322',
      'XD1230', 'XD1030', 'XD230',
      'HD922', 'HD920', 'A915', 'HD917',
      'HD972', 'HD970', 'AU320']);

  appSignMetadata.monitorOrientation = buildSelectFieldPresentationItem(
    'monitorOrientation',
    bsdmSignMetadata.monitorOrientation,
    ['meta', 'monitorOrientation'],
    [
      'Landscape',
      'Portrait__bottom_on_left',
      'Portrait__bottom_on_right'
    ]
  );

  appSignMetadata.videoConnector = buildSelectFieldPresentationItem(
    'videoConnector',
    bsdmSignMetadata.videoConnector,
    ['meta', 'videoConnector'],
    [
      'HDMI',
      'VGA',
      'Component'
    ]
  );

  appSignMetadata.deviceWebPageDisplay = buildSelectFieldPresentationItem(
    'deviceWebPageDisplay',
    bsdmSignMetadata.deviceWebPageDisplay,
    ['meta', 'deviceWebPageDisplay'],
    [
      'None',
      'Standard',
      'Custom'
    ]
  );

  appSignMetadata.alphabetizeVariableNames = buildCheckboxPresentationItem(
    'alphabetizeVariableNames',
    bsdmSignMetadata.alphabetizeVariableNames,
    ['meta', 'alphabetizeVariableNames']);

  appSignMetadata.delayScheduleChangeUntilMediaEndEvent = buildCheckboxPresentationItem(
    'delayScheduleChangeUntilMediaEndEvent',
    bsdmSignMetadata.delayScheduleChangeUntilMediaEndEvent,
    ['meta', 'delayScheduleChangeUntilMediaEndEvent']);

  appSignMetadata.htmlEnableJavascriptConsole = buildCheckboxPresentationItem(
    'htmlEnableJavascriptConsole',
    bsdmSignMetadata.htmlEnableJavascriptConsole,
    ['meta', 'htmlEnableJavascriptConsole']);

  // TODO
  // appSignMetadata.backgroundScreenColor = bsdmSignMetadata.backgroundScreenColor;
  // appSignMetadata.backgroundScreenColor.a = 255;
  // appSignMetadata.backgroundScreenColor.r = 0;
  // appSignMetadata.backgroundScreenColor.g = 0;
  // appSignMetadata.backgroundScreenColor.b = 0;

  appSignMetadata.forceResolution = buildCheckboxPresentationItem(
    'forceResolution',
    bsdmSignMetadata.forceResolution,
    ['meta', 'forceResolution']);

  appSignMetadata.tenBitColorEnabled = buildCheckboxPresentationItem(
    'tenBitColorEnabled',
    bsdmSignMetadata.tenBitColorEnabled,
    ['meta', 'tenBitColorEnabled']);

  // TODO
  // appSignMetadata.monitorOverscan = 'noOverscan';   // TODO not in bsdm

  appSignMetadata.gpio = bsdmSignMetadata.gpio;

  appSignMetadata.buttonPanels = bsdmSignMetadata.buttonPanels;

  appSignMetadata.serialPortConfigurations = bsdmSignMetadata.serialPortConfigurations;

  appSignMetadata.udpDestinationAddressType = buildSelectFieldPresentationItem(
    'udpDestinationAddressType',
    bsdmSignMetadata.udpDestinationAddressType,
    ['meta', 'udpDestinationAddressType'],
    [
      'IPAddress',
      'LocalSubnet',
      'Ethernet',
      'Wireless'
    ]
  );

  appSignMetadata.udpDestinationAddress = buildTextPresentationItem(
    'udpDestinationAddress',
    bsdmSignMetadata.udpDestinationAddress,
    ['meta', 'udpDestinationAddress']);

  appSignMetadata.udpDestinationPort = buildTextPresentationItem(
    'udpDestinationPort',
    bsdmSignMetadata.udpDestinationPort,
    ['meta', 'udpDestinationPort']);
  
  appSignMetadata.udpReceiverPort = buildTextPresentationItem('udpReceiverPort', bsdmSignMetadata.udpReceiverPort,
    ['meta', 'udpReceiverPort']);

  appSignMetadata.flipCoordinates = buildCheckboxPresentationItem(
    'flipCoordinates',
    bsdmSignMetadata.flipCoordinates,
    ['meta', 'flipCoordinates']);
  
  appSignMetadata.touchCursorDisplayMode = buildSelectFieldPresentationItem(
    'touchCursorDisplayMode',
    bsdmSignMetadata.touchCursorDisplayMode,
    ['meta', 'touchCursorDisplayMode'],
    [
      'Disabled',
      'Auto',
      'Display'
    ]
  );

  appSignMetadata.language = buildTextPresentationItem('language', bsdmSignMetadata.language,
    ['meta', 'language']);

  appSignMetadata.languageKey = buildTextPresentationItem('languageKey', bsdmSignMetadata.languageKey,
    ['meta', 'languageKey']);

  appSignMetadata.audioConfiguration = bsdmSignMetadata.audioConfiguration;

  appSignMetadata.inactivityTimeout = buildCheckboxPresentationItem(
    'inactivityTimeout',
    bsdmSignMetadata.inactivityTimeout,
    ['meta', 'inactivityTimeout']);

  appSignMetadata.inactivityTime = buildTextPresentationItem('inactivityTime', bsdmSignMetadata.inactivityTime,
    ['meta', 'inactivityTime']);

  appSignMetadata.autoCreateMediaCounterVariables = buildCheckboxPresentationItem(
    'autoCreateMediaCounterVariables',
    bsdmSignMetadata.autoCreateMediaCounterVariables,
    ['meta', 'autoCreateMediaCounterVariables']);

  appSignMetadata.resetVariablesOnPresentationStart = buildCheckboxPresentationItem(
    'resetVariablesOnPresentationStart',
    bsdmSignMetadata.resetVariablesOnPresentationStart,
    ['meta', 'resetVariablesOnPresentationStart']);

  appSignMetadata.networkedVariablesUpdateInterval = buildTextPresentationItem(
    'networkedVariablesUpdateInterval', bsdmSignMetadata.networkedVariablesUpdateInterval,
    ['meta', 'networkedVariablesUpdateInterval']);

  appSignMetadata.graphicsZOrder = buildSelectFieldPresentationItem(
    'graphicsZOrder',
    bsdmSignMetadata.graphicsZOrder,
    ['meta', 'graphicsZOrder'],
    [
      'Back',
      'Middle',
      'Front'
    ]
  );

  appSignMetadata.isMosaic = buildCheckboxPresentationItem(
    'isMosaic',
    bsdmSignMetadata.isMosaic,
    ['meta', 'isMosaic']);


  // not part of metadata
  // TODO - correct defaults?
  appSignMetadata.userDefinedEvents = [];
  appSignMetadata.userVariables = [];
  appSignMetadata.liveDataFeeds = [];
  appSignMetadata.scriptPlugins = [];
  appSignMetadata.parserPlugins = [];
  appSignMetadata.htmlSites = [];
  appSignMetadata.presentationIdentifiers = [];
  appSignMetadata.beacons = [];

  return appSignMetadata;
}

function getSignParams(appSignMetadata) {
  
  let signParams = {};

  signParams.id = appSignMetadata.id;
  // signParams.name = appSignMetadata.name;
  // signParams.videoMode = appSignMetadata.videoMode.value;
  signParams.model = appSignMetadata.model.value;
  signParams.monitorOrientation = appSignMetadata.monitorOrientation.value;
  signParams.videoConnector = appSignMetadata.videoConnector.value;
  signParams.udpDestinationAddressType = appSignMetadata.udpDestinationAddressType.value;
  signParams.alphabetizeVariableNames = appSignMetadata.alphabetizeVariableNames.value;
  signParams.delayScheduleChangeUntilMediaEndEvent = appSignMetadata.delayScheduleChangeUntilMediaEndEvent.value;
  signParams.htmlEnableJavascriptConsole = appSignMetadata.htmlEnableJavascriptConsole.value;
  // signParams.backgroundScreenColor = appSignMetadata.backgroundScreenColor;
  signParams.forceResolution = appSignMetadata.forceResolution.value;
  signParams.tenBitColorEnabled = appSignMetadata.tenBitColorEnabled.value;
  // monitor overscan
  // ?gpio
  // ?buttonPanels
  // ?serialPortConfigurations
  signParams.udpDestinationAddressType = appSignMetadata.udpDestinationAddressType.value;
  signParams.udpDestinationAddress = appSignMetadata.udpDestinationAddress.value;
  signParams.udpDestinationPort = appSignMetadata.udpDestinationPort.value;
  signParams.udpReceiverPort = appSignMetadata.udpReceiverPort.value;
  signParams.flipCoordinates = appSignMetadata.flipCoordinates.value;
  signParams.touchCursorDisplayMode = appSignMetadata.touchCursorDisplayMode.value;
  signParams.language = appSignMetadata.language.value;
  signParams.languageKey = appSignMetadata.languageKey.value;
  // ?audioConfiguration
  signParams.inactivityTimeout = appSignMetadata.inactivityTimeout.value;
  signParams.inactivityTime = appSignMetadata.inactivityTime.value;
  signParams.autoCreateMediaCounterVariables = appSignMetadata.autoCreateMediaCounterVariables.value;
  signParams.resetVariablesOnPresentationStart = appSignMetadata.resetVariablesOnPresentationStart.value;
  signParams.networkedVariablesUpdateInterval = appSignMetadata.networkedVariablesUpdateInterval.value;
  signParams.graphicsZOrder = appSignMetadata.graphicsZOrder.value;
  signParams.isMosaic = appSignMetadata.isMosaic.value;

  return signParams;
}

function getZoneMetadata(bsdm, zoneId) {

  const zone = dmGetZoneById(bsdm, { id: zoneId });
  const zoneProperties = zone.properties;

  let appZoneMetadata = {};

  appZoneMetadata.absolutePosition = zone.absolutePosition;
  appZoneMetadata.id = zone.id;
  appZoneMetadata.initialMediaStateId = zone.initialMediaStateId;
  appZoneMetadata.name = zone.name;
  appZoneMetadata.nonInteractive = zone.nonInteractive;
  appZoneMetadata.percentagePosition = zone.percentagePosition;
  appZoneMetadata.type = ZoneTypeCompactName(zone.type);
  appZoneMetadata.videoMode = zone.videoMode;

  // TODO - reconsider this strategy - may only want to publish relevant parameters
  appZoneMetadata.properties = clone(zoneProperties);

  appZoneMetadata.properties.viewMode = ViewModeTypeName(zoneProperties.viewMode);
  appZoneMetadata.properties.imageMode = ImageModeTypeName(zoneProperties.imageMode);

  // TODO - switch these next two to use new enums from Jim - see Slack entries on 9 February
  appZoneMetadata.properties.audioOutput = AudioOutputSelectionSpecName(zoneProperties.audioOutput);
  appZoneMetadata.properties.audioMode = AudioModeSpecName(zoneProperties.audioMode);

  appZoneMetadata.properties.audioMapping = AudioMappingTypeName(zoneProperties.audioMapping);
  appZoneMetadata.properties.audioMixMode = AudioMixModeTypeName(zoneProperties.audioMixMode);

  appZoneMetadata.properties.liveVideoInput = LiveVideoInputTypeName(zoneProperties.liveVideoInput);
  appZoneMetadata.properties.liveVideoStandard = LiveVideoStandardTypeName(zoneProperties.liveVideoStandard);

  appZoneMetadata.properties.analogOutput = AudioOutputTypeName(zoneProperties.audioOutputAssignments.analog1);
  appZoneMetadata.properties.analog2Output = AudioOutputTypeName(zoneProperties.audioOutputAssignments.analog2);
  appZoneMetadata.properties.analog3Output = AudioOutputTypeName(zoneProperties.audioOutputAssignments.analog3);
  appZoneMetadata.properties.hdmiOutput = AudioOutputTypeName(zoneProperties.audioOutputAssignments.hdmi);
  appZoneMetadata.properties.spdifOutput = AudioOutputTypeName(zoneProperties.audioOutputAssignments.spdif);
  appZoneMetadata.properties.usbOutputA = AudioOutputTypeName(zoneProperties.audioOutputAssignments.usbA);
  appZoneMetadata.properties.usbOutputB = AudioOutputTypeName(zoneProperties.audioOutputAssignments.usbB);
  appZoneMetadata.properties.usbOutputC = AudioOutputTypeName(zoneProperties.audioOutputAssignments.usbC);
  appZoneMetadata.properties.usbOutputD = AudioOutputTypeName(zoneProperties.audioOutputAssignments.usbD);

  return appZoneMetadata;
}

function getPlaylistMetadata(bsdm, zone) {

  let playlist = {};

  playlist.name = 'Playlist 0'; // TODO
  // TODO - note the following two parameters are duplicated in autorun due to the fact that bsdm stores them there
  playlist.type = zone.nonInteractive ? 'non-interactive' : 'interactive';
  playlist.initialMediaStateId = zone.initialMediaStateId;
  const mediaState = dmGetMediaStateById(bsdm, { id: zone.initialMediaStateId});
  playlist.initialMediaStateName = mediaState.name;
  return playlist;
}

function getPlaylistStates(mediaStates, eventsById) {

  let states = [];

  mediaStates.forEach( (mediaState) => {
    let autorunState = {};
    autorunState.name = mediaState.name;

    const mediaStateEvent = eventsById[mediaState.eventList[0].id];

    const contentItemType = mediaState.contentItem.type;
    switch (contentItemType) {
      case ContentItemType.Image:
        {
          autorunState.imageItem = {};
          autorunState.imageItem.stateName = mediaState.name;
          autorunState.imageItem.fileName = path.basename(mediaState.contentItem.assetId);//TODO path this needs to be resolved outside of publish module
          autorunState.imageItem.filePath = mediaState.contentItem.assetId;//TODO path this needs to be resolved outside of publish module

          // TODO - fileIsLocal unused in current autorun - conceivable that it would be used?
          // autorunState.imageItem.fileIsLocal = true;

          autorunState.imageItem.slideDelayInterval = mediaStateEvent.data.interval;
          autorunState.imageItem.slideTransition = TransitionTypeName(mediaStateEvent.transitionList[0].type);
          autorunState.imageItem.transitionDuration = 1000;   // TODO - badm
          autorunState.imageItem.videoPlayerRequired = false; // TODO - badm
          autorunState.imageItem.useImageBuffer = false; // TODO - badm
          break;
        }
      case ContentItemType.Video:
        {
          autorunState.videoItem = {};
          autorunState.videoItem.stateName = mediaState.name;
          // autorunState.videoItem.fileName = mediaState.name;   // this fileName does not include extension
          autorunState.videoItem.fileName = path.basename(mediaState.contentItem.assetId);//TODO path this needs to be resolved outside of publish module
          autorunState.videoItem.filePath = mediaState.contentItem.assetId;//TODO path this needs to be resolved outside of publish module

          autorunState.videoItem.videoDisplayMode = '2D';
          autorunState.videoItem.automaticallyLoop = true;
          break;
        }
      default:
        break;
    }
    states.push(autorunState);
  });

  return states;
}

function getPlaylistTransitions(transitions, mediaStatesById, eventsById) {

  let autorunTransitions = [];

  transitions.forEach( (transition) => {
    let autorunTransition = {};

    const event = eventsById[transition.eventId];
    const sourceMediaStateId = event.mediaStateId;
    const sourceMediaState = mediaStatesById[sourceMediaStateId];

    const targetMediaStateId = event.transitionList[0].targetMediaStateId;
    const targetMediaState = mediaStatesById[targetMediaStateId].name;

    autorunTransition.sourceMediaState = sourceMediaState.name;
    autorunTransition.userEvent = {};

    const badmEventName = EventTypeName(event.type);
    autorunTransition.userEvent.parameters = [];
    if (badmEventName === 'Timer') {
      autorunTransition.userEvent.name = 'timeout';
      autorunTransition.userEvent.parameters.push(event.data.interval);
    }
    else {
      autorunTransition.userEvent.name = 'mediaEnd';
      autorunTransition.userEvent.parameters.push(null);
    }

    autorunTransition.targetMediaState = targetMediaState;
    autorunTransition.targetMediaStateIsPreviousState = false;
    autorunTransition.assignInputToUserVariable = false;
    autorunTransition.assignWildcardToUserVariable = false;
    autorunTransitions.push(autorunTransition);
  });

  return autorunTransitions;
}

function getMediaStates(badm, zoneId, autorunPlaylist) {

  let mediaStates = [];
  let mediaStatesById = {};

  let events = [];
  let eventsById = {};
  let transitions = [];

  const mediaStateIds = dmGetZoneSimplePlaylist(badm, { id: zoneId});
  mediaStateIds.forEach( (mediaStateId) => {
    const mediaState = dmGetMediaStateById(badm, { id: mediaStateId});
    mediaStates.push(mediaState);
    mediaStatesById[mediaStateId] = mediaState;

    const eventIdsForMediaState = dmGetEventIdsForMediaState(badm, { id: mediaStateId});
    const eventId = eventIdsForMediaState[0];
    const event = dmGetEventById(badm, { id: eventId});
    events.push(event);
    eventsById[eventId] = event;

    const transitionIdsForEvent = dmGetTransitionIdsForEvent(badm, { id: eventIdsForMediaState[0]});
    const transition = dmGetTransitionById(badm, { id: transitionIdsForEvent[0]});
    transitions.push(transition);
  });


  autorunPlaylist.states = getPlaylistStates(mediaStates, eventsById);
  autorunPlaylist.transitions = getPlaylistTransitions(transitions, mediaStatesById, eventsById);
}

