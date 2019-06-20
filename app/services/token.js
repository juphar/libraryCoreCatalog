/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Sample app service calling sample platform service (modifying the passed back data string).
 *
 */
'use strict';

const sendBackendRequest  = require('../utils/http_util').sendBackendRequest;
const validate            = require('../utils/service_util').validate;
const getQryStr           = require('../utils/service_util').getQryStr;
const logger              = require('../logging/logger').getLogger(__filename);
const ok                  = require('../utils/response_util').ok;
const error               = require('../utils/response_util').error;

const AUTH_APIKEY         = process.env.AUTH_APIKEY;
const AUTH_ID             = process.env.AUTH_ID;
const TENANT_ID           = process.env.TENANT_ID;

module.exports = exports = {};

exports.path = '/token';

exports.method = 'GET';

exports.callback = function(req, res) {

  let inputData			      = 'apikey=' + AUTH_APIKEY + '&id=' + AUTH_ID;
  let requiredKeys		    = [];
  let platformPath        = '/auth/token';
  let platformQryTemplate = '';

  if( validate(req,requiredKeys) ) {

    sendBackendRequest('POST', platformPath + '?' + getQryStr(req,platformQryTemplate), inputData, 'application/x-www-form-urlencoded' )
      .then((data) => { 
        if( data && data.access_token ) {
          res.type('json');
          res.status(200).send(ok({ access_token: data.access_token, tenant_id: TENANT_ID }));
        } else {
          res.status(500).send('Error retrieving token');
        }
      })
      .catch((error) => {
        res.type('json');
        res.status(error.code).send(error);
      });

  } else {

    logger.error('Failed query param check');    
    res.status(400).send(error(400, 'Input error', 'Missing query param'));

  }

}

