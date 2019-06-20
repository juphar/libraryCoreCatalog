/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 * @author Watson Education
 *
 * Setups and inializes the server for Auth.
 *
 */
'use strict';

let winston = require('winston');

winston.level = (process.env.NODE_ENV === 'production') ? 'info': 'debug';
// We need to remove the default Console logger so we can have a custom logger format.
// winston.remove(winston.transports.Console);

// the RFC5424 levels
let customLevels = {
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    event: 5, // custom level
    info: 6,
    debug: 7
  },
  colors: {
    emerg: 'red',
    alert: 'red',
    crit: 'red',
    error: 'red',
    warning: 'yellow',
    notice: 'cyan',
    event: 'grey', // custom level
    info: 'green',
    debug: 'blue'
  }
};

winston.setLevels(customLevels.levels);
winston.addColors(customLevels.colors);

function getClassName(fileName){
  let srcIndex = fileName.indexOf('/src/');
  let jsIndex = fileName.lastIndexOf('.js');
  return fileName.substring(srcIndex + 5, jsIndex).replace(/[\/\\]/g, '.'); // between src and .js
}

module.exports = {
  getLogger: function(fileName) {
    // TODO: update the formatter once we have one for Java.
    let className = getClassName(fileName);

    // Method to format logs using a log4j format string.
    function format(formatString) {
      const LINE_SEPERATOR = require('os').EOL;

      let prefixPattern = '[\\.\\-]?[\\d]+';
      let prefixRegex = new RegExp(prefixPattern, 'g');
      let regex = new RegExp(`%((?:${prefixPattern})*)([cCdFlLmMnprtxX%])(?:{(.*?)})?`, 'g');
      let match;
      // can work on C, d, m, n, p, and %
      let formatStringCopy = '' + formatString;
      let methods = [];
      while(match = regex.exec(formatString)) {
        let currentLength = methods.length;
        let fullMatch = match[0];
        let prefix = match[1];
        let prefixes = [];
        let prefixMatch;
        while(prefixMatch = prefixRegex.exec(prefix)) {
          prefixes.push(prefixMatch[0]);
        }
        let tag = match[match.length - 2];
        let postfix = match[match.length - 1];

        if ('c' === tag || 'C' === tag) {
          methods.push(getClassFormatter(className, prefixes, postfix));
        } else if ('d' === tag) {
          methods.push(getDateFormatter(prefixes, postfix));
        } else if ('m' === tag) {
          methods.push(function(className, priority, date, message, lineSeperator) {
            return message;
          });
        } else if ('n' === tag) {
          methods.push(function(className, priority, date, message, lineSeperator) {
            return LINE_SEPERATOR;
          });
        } else if ('p' === tag) {
          methods.push(function(className, priority, date, message, lineSeperator) {
            return priority;
          });
        } else if ('%' === tag) {
          methods.push(function(className, priority, date, message, lineSeperator) {
            return '%';
          });
        }

        if (currentLength < methods.length) {
          formatStringCopy = formatStringCopy.replace(fullMatch, '${methods[' + currentLength + '](className, priority, date, message, LINE_SEPERATOR)}')
        }
      }
      return function(options) {
        let date = new Date();
        let message = options.message;
        let priority = options.level.toUpperCase();

        return eval('`' + formatStringCopy + '`');
      }
    }

    let result = winston.loggers.add(className, {
      console: {
        level: winston.level,
        colorize: true,
        formatter: format('%d{yyyy-MM-ddTHH:mm:ss.SSSZ} [%p] %c - %m%n')/*function(options) {
          return `${options.timestamp()} [${options.level.toUpperCase()}] ${className} - ${(options.message) ? options.message: ''} ${(options.meta && Object.keys(options.meta).length) ? '\n\t' + JSON.stringify(options.meta) : ''}`;
        }*/
      },
    });
    // Need to manually set levels becaus the logger container doesn't automatically get winston's logging levels.
    result.setLevels(customLevels.levels);
    // result.setColors(customLevels.colors);
    return result;
  }
}

function getClassFormatter(className, prefixes, postfix) {
  // TODO: use prefixes... it doesn't usually make sense... but we can use it.
  let numValues = className.length;
  if (postfix) {
    numValues = parseInt(postfix);
  }
  let divisions = className.split('.');
  let outputValue = divisions.splice(Math.max(0, divisions.length - numValues)).join('.');
  return function (className, priority, date, message, lineSeperator) {
    return outputValue;
  }
}

const DATE_REGEX = /(G+|y+|M+|w+|W+|D+|d+|F+|E+|a+|H+|k+|K+|h+|m+|s+|S+|z+|Z+)/g;

function getDateFormatter(prefixes, postfix) {
  let dateFunctions = [];
  let dateFormat = '' + postfix;
  if (postfix) {
    let match;
    while(match = DATE_REGEX.exec(postfix)) {
      let tag = match[0];
      let currentLength = dateFunctions.length;
      if (tag.startsWith('y')) {
        if (tag.length <= 2) {
          dateFunctions.push(function(date){
            return date.getUTCFullYear() % 100;
          });
        } else {
          dateFunctions.push(function(date) {
            return date.getUTCFullYear();
          })
        }
      } else if (tag.startsWith('M')) {
        if (tag.length <= 2) {
          dateFunctions.push(function(date){
            return padTime(date.getUTCMonth(), tag.length - 1);
          });
        } else {
          dateFunctions.push(function(date) {
            return getMonthString(date.getUTCMonth(), tag.length);
          })
        }
      } else if (tag.startsWith('d')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCDate(), Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('E')) {
        dateFunctions.push(function(date) {
          return getDayOfWeekString(date.getUTCDay(), tag.length);
        });
      } else if (tag.startsWith('a')) {
        dateFunctions.push(function(date) {
          return (date.getUTCHours() < 12) ? 'AM' : 'PM';
        });
      } else if (tag.startsWith('H')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCHours(), Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('k')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCHours() + 1, Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('K')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCHours() % 12, Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('h')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCHours() % 12 + 1, Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('m')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCMinutes(), Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('s')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCSeconds(), Math.min(1, tag.length - 1));
        });
      } else if (tag.startsWith('S')) {
        dateFunctions.push(function(date) {
          return padTime(date.getUTCMilliseconds(), tag.length);
        });
      } else if (tag.startsWith('z')) {
        if (tag.length > 3) {
          dateFunctions.push(function(date) {
            return 'Coordinated Universal Time';
          });
        } else {
          dateFunctions.push(function(date) {
            return 'UTC';
          });
        }
      } else if (tag.startsWith('Z')) {
        dateFunctions.push(function(date) {
          return '+0000';
        });
      }
      if (currentLength < dateFunctions.length) {
        dateFormat = dateFormat.replace(tag, '${dateFunctions[' + currentLength + '](date)}');
      }
    }
  } else {
    // default date format.
    dateFunctions.push(function(date){
      return date.toISOString();
    });
    dateFormat = dateFormat + '${dateFunctions[0](date)}';
  }
  return function(className, priority, date, message, lineSeperator) {
    return eval('`' + dateFormat + '`');
  }
}

function padTime(value, padding) {
  if (padding > 0) {
    if (value < padding * 10) {
      let result = '' + value;
      return '0'.repeat(padding * result.length) + result;
    }
  }
  return value;
}

function getMonthString(monthInt, stringLength) {
  let monthString;
  switch (monthInt) {
    case 0:
      monthString = 'January';
      break;
    case 1:
      monthString = 'February';
      break;
    case 2:
      monthString = 'March';
      break;
    case 3:
      monthString = 'April';
      break;
    case 4:
      monthString = 'May';
      break;
    case 5:
      monthString = 'June';
      break;
    case 6:
      monthString = 'July';
      break;
    case 7:
      monthString = 'August';
      break;
    case 8:
      monthString = 'September';
      break;
    case 9:
      monthString = 'October';
      break;
    case 10:
      monthString = 'November';
      break;
    case 11:
      monthString = 'December';
      break;
  }
  if (stringLength > 3) {
    return monthString;
  } else {
    return monthString.substring(0,3);
  }
}

function getDayOfWeekString(dayOfWeekInt, stringLength) {
  let dayOfWeekString;
  switch (dayOfWeekInt) {
    case 0:
      dayOfWeekString = 'Sunday';
      break;
    case 1:
      dayOfWeekString = 'Monday';
      break;
    case 2:
      dayOfWeekString = 'Tuesday';
      break;
    case 3:
      dayOfWeekString = 'Wednesday';
      break;
    case 4:
      dayOfWeekString = 'Thursday';
      break;
    case 5:
      dayOfWeekString = 'Friday';
      break;
    case 6:
      dayOfWeekString = 'Saturday';
      break;
  }
  if (stringLength > 3) {
    return dayOfWeekString;
  } else {
    return dayOfWeekString.substring(0,3);
  }
}
