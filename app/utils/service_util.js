/*
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Helper functions for service creation.
 *
 */
'use strict';

module.exports = exports = {};

// Validates if all the required query params are present in the req object
exports.validate = function(req, requiredKeys) {

  var isValid = true;

  for( let i = 0; i < requiredKeys.length; i++ ) {

    let key = requiredKeys[i];

    if( !req.query[key] && req.query[key] != false && req.query[key] != 0 ) {

      isValid = false;
      break;

    }

  }

  return isValid;

}

// Constructs query string  given query string template
// [???] is replaced by value of req.query[???]
// Ex: template is key1=[ABC]&key2=[123]&key3=XYZ
//     req.query[ABC] = 'A', req.query[123] = '1', req.query[XYZ] = 'X'
//     method returns: key1=A&key2=1&key3=XYZ
exports.getQryStr = function(req, qryTemplate) {

  var qryStr = "";

  let qryTemplateArray = qryTemplate.split('&');

  qryTemplateArray.forEach(function( subQryStr) {

    if( qryStr ) qryStr = qryStr + '&';

    var idx = subQryStr.indexOf('[');

    if( idx < 0 ) qryStr = qryStr + subQryStr;

    else {

      let reqKey = subQryStr.substring( idx + 1, subQryStr.length - 1 );

      if( req.query[reqKey] || req.query[reqKey] === false || req.query[reqKey] === 0 )    
        qryStr = qryStr + subQryStr.substring( 0, idx ) + req.query[reqKey];

    }

  });

  return qryStr;

}
