/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Handles calls to platform APIs.
 *
 */
'use strict';

const PLATFORM_API_HOST       = process.env.PLATFORM_API_HOST;
const PLATFORM_API_PORT       = process.env.PLATFORM_API_PORT;
const PLATFORM_API_USE_HTTPS  = process.env.PLATFORM_API_USE_HTTPS;

const httpOrHttps = ( PLATFORM_API_USE_HTTPS && PLATFORM_API_USE_HTTPS != "false" ) ? require('https') : require('http');
const requestAgent = new httpOrHttps.Agent(); // creating an agent for the requests so we can limit affecting configurations globally.
const logger = require('../logging/logger').getLogger(__filename);
const response_util = require('./response_util');

module.exports = exports = {};

/**
 * 
 * @param {string} method - GET/POST/PUT/DELETE 
 * @param {string} path - Platform API path
 * @param {*} inputData - Post body or service req object if directly streaming
 * @param {string} contentType - Content-Type header, defaults to application/json
 * @param {string} token - Authorization header, ex: Bearer token 
 * @param {json} config - Additional config
 * @param {boolean} config.useStream - Directly streams from req object (inputData) to Platfrom API call
 * 
 */
exports.sendBackendRequest = function (method, path, inputData, contentType, token, config) {

  if( !method ) method = "GET";
  if( !contentType ) contentType = "application/json";
  if( !config ) config = {};

  if( inputData && contentType.indexOf('application/json') < 0 ) {
    logger.debug(`Calling Path: ${path} with method: ${method} and input of type: ${contentType}`);
  } else if ( inputData ) {
    logger.debug(`Calling Path: ${path} with method: ${method} and input: ${JSON.stringify(inputData)}`);
  } else {
    logger.debug(`Calling Path: ${path} with method: ${method}`);    
  }

  let options = {
    hostname  : PLATFORM_API_HOST,
    port      : PLATFORM_API_PORT,
    path      : path,
    method    : method,
    agent     : requestAgent,
    headers   : {
      'Content-Type'  : contentType
    }
  };

  if ( token ) options.headers.Authorization = token;

  return new Promise((resolve, reject) => {
    let request = httpOrHttps.request(options, (response) => {
      logger.debug(`PATH: ${path}, STATUS: ${response.statusCode}, HEADERS: ${JSON.stringify(response.headers)}`);
      let isJson = ( response.headers['content-type'] && response.headers['content-type'].indexOf('application/json') > -1 );
      response.setEncoding('utf8');
      let responseString = '';
      response.on('data', (chunk) => {
        responseString = responseString + chunk;
      });
      response.on('end', () => {
        if (response.statusCode < 400) {
          let responseData = responseString;
          if (isJson) {
            try {
              responseData = JSON.parse(responseString);
            } catch (e) {
              logger.error(`Path: ${path} is not actually JSON. Returned: ${responseString}`);
              return reject(response_util.error(500,
                'SERVER_ERROR',
                `Unable to handle request.`));
            }
          }
          return resolve(responseData);
        } else {
          return reject(response_util.error(response.statusCode,
            (response.statusCode < 500) ? 'BAD_REQUEST':'SERVER_ERROR',
            `Path ${path} returned with status code: ${response.statusCode}`));
        }
      });
    });

    request.on('error', (error) => {
      logger.error(JSON.stringify(error));
      return reject(response_util.error(500, 'SERVER_ERROR', 'Unable to handle request.'));
    });

    if( config.useStream ) {
      inputData.pipe(request);
    } else if ( inputData && contentType.indexOf('application/json') < 0 ) {
      request.write(inputData);
      request.end();   
    } else if ( inputData ) {
      request.write(JSON.stringify(inputData));
      request.end();
    } else {
      request.end();
    }

  });
}
