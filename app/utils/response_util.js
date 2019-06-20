/**
 * Copyright 2018 IBM Corp. All Rights Reserved.
 * @author IBM Watson Education
 *
 * Gives utils for an express response.
 *
 */
'use strict';

module.exports = exports = {};

exports.ok = function(data) {
  return {
    status: 200,
    message: 'OK',
    result: data
  };
}

exports.error = function(code, error, description) {
  return {
    code: code,
    error: error,
    description: description
  }
}
