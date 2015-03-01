'use strict';

var
  assign = require('lodash/object/assign'),
  assert = require('assert');

var
  getByKey = function getByKey (arr, key) {
    assert(typeof arr.filter === 'function',
      'arr should suplly a .filter() method');

    var row = arr.filter(function (row) {
      return Object.keys(row).indexOf(key) >= 0;
    })[0];

    return row ? row[key] : undefined;
  },

  whitelist = function whitelist (arr, keyWhitelist) {
    assert(typeof arr.filter === 'function',
      'arr should supply .filter() method.');

    assert(typeof keyWhitelist.indexOf === 'function',
      'keyWhitelist should supply .indexOf method.');

    var whitelisted = arr.filter(function (row) {
      var keys = Object.keys(row),

        result = keys.filter(function (key) {
          return keyWhitelist.indexOf(key) >= 0;
        });

      return Boolean(result.length);
    });

    return whitelisted;
  },

  concat = function concat (arr) {
    return assign.apply(null, [{}].concat(arr));
  };

var objectList = function objectList (arr) {
  return {
    getByKey: function (key) {
      return getByKey.apply(null, [arr, key]);
    },
    whitelist: function (keyWhitelist) {
      return whitelist.apply(null, [arr, keyWhitelist]);
    },
    concat: function () {
      return concat(arr);
    }
  };
};

assign(objectList, {
  getByKey: getByKey,
  whitelist: whitelist,
  concat: concat
});

module.exports = objectList;
