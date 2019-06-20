/*
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Gives api routes.
 *
 */
'use strict';

// List of pass-through GET services - no additional service file provided
// [ { clientPath : path, platformPath : path }, ... ]
let ptSrvsList = [];

// List of custom services - additional service file provided
// [ "serviceFileName", ... ]
let ctSrvsList = [ "token" ];

const express	= require('express');
const router	= express.Router();
const logger	= require('./logging/logger').getLogger(__filename);

const ok                  = require('./utils/response_util').ok;
const error               = require('./utils/response_util').error;
const sendBackendRequest  = require('./utils/http_util').sendBackendRequest;

// Admin route: do not remove
router.get('/admin/health', function (req, res) {
  let response200 = ok('I am healthy!');
  res.type('json');
  res.status(200).send(response200);
})

// Pass-through service routes: remove if not used
ptSrvsList.forEach( function(serviceItem) {

  router.get(serviceItem.clientPath, function (req, res) {

    let qryStr = "";

    for( let key in req.query ) {

      if( qryStr ) qryStr = qryStr + '&';

      qryStr = qryStr + key + '=' + encodeURIComponent(req.query[key]);

    }

    let inputData = null;
    let token = null;

    if( req.headers.authorization ) token = req.headers.authorization;    

    sendBackendRequest('GET', serviceItem.platformPath + ( qryStr ? '?' + qryStr : '' ), inputData, null, token)
      .then((data) => {
        res.type('json');
        res.status(200).send(data);
      })
      .catch((error) => {
        res.type('json');
        res.status(error.code).send(error);
      });

  });

})

// Service routes: remove if not used
ctSrvsList.forEach( function(serviceItem) {

  let service = require('./services/' + serviceItem);

  let method = ( service.method ) ? service.method.toLowerCase() : 'get';

  if( service.middleware ) router[method]( service.path, service.middleware, service.callback );
  else router[method]( service.path, service.callback );

});

module.exports = router;
