/*
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Gives api routes.
 *
 */
'use strict';

const express	    = require('express');
const router	    = express.Router();
const bodyParser  = require('body-parser');

const ok      = require('../app/utils/response_util').ok;

// Sample platform service: remove
router.get('/samplePlatformService', function (req, res) {
  
  if( !req.query || !(req.query['key1'] || req.query['key2'] ) ) {

    // TODO: Error response
    res.status(500).send();
    return;

  }

  let dynamicStr = "";

  dynamicStr = req.query['key1'] ? 'key1=' + req.query['key1'] : "";
  if( dynamicStr && req.query['key2'] ) dynamicStr = dynamicStr + '&';
  dynamicStr = dynamicStr + ( req.query['key2'] ? 'key2=' + req.query['key2'] : "" );

  let response200 = ok('Pass-through data from sample platform service with query string' + ( dynamicStr ? ' ' + dynamicStr : '' ));

  res.type('json');
  res.status(200).send(response200);

});

router.post('/samplePlatformService', bodyParser.text(), function (req, res) {
  
  let response200 = ok('Pass-through data from sample platform service with postbody ' + req.body);

  res.type('json');
  res.status(200).send(response200);

});

module.exports = router;
