/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Starts app server.
 *
 */
'use strict';

const PORT = 8080;

const express	= require('express');
const app		= express();
const logger	= require('./logging/logger').getLogger(__filename);
const services	= require('./services');

// Static docs
app.use(express.static(__dirname + '/public'));
app.use('/docs', express.static(__dirname + '/docs'));

// APP Services
app.use('/services/', services);

// 500 errors
app.use(function (err, req, res, next) {
	logger.error(err.stack);
	let response500 = {code: 500, error: "UNEXPECTED_EXCEPTION", description: err};
	res.type('json');
	res.status(500).send(JSON.stringify(response500, null, 2))
});

// 404 errors
app.use(function (req, res, next) {
	logger.info("req.url: " + req.url);
	let response404 = {code: 404, error: "NOT_FOUND", description: "Resource not found"};
	res.type('json');
  	res.status(404).send(JSON.stringify(response404, null, 2))
});

// Start server
app.listen(PORT, function() {
	logger.info(`started server on port: ${PORT}`);
});

// Export is used for unit testing
function test() {return server;}
module.exports = test;
