'use strict';

var
  assert = require('assert'),
  lodash = require('lodash'),
  cWhere = require('lodash').where;

var
  assign = lodash.assign,
  getKeys = Object.keys;

var
  getByKey = function getByKey (collection, key) {
    return lodash(collection).pluck(key).first();
  },

  whitelist = function whitelist (collection, keyWhitelist) {
    assert(typeof collection.filter === 'function',
      'collection should supply .filter() method.');

    assert(typeof keyWhitelist.indexOf === 'function',
      'keyWhitelist should supply .indexOf method.');

    var whitelisted = collection.filter(function (record) {
      var keys = getKeys(record),

        result = keys.filter(function (key) {
          return keyWhitelist.indexOf(key) >= 0;
        });

      return Boolean(result.length);
    });

    return whitelisted;
  },

  concat = function concat (collection) {
    return assign.apply(null, [{}].concat(collection));
  },

  where = function where (collection, predicates) {
    return cWhere (collection, predicates);
  };

var objectList = function objectList (collection) {
  return {
    getByKey: function (key) {
      return getByKey.apply(null, [collection, key]);
    },
    whitelist: function (keyWhitelist) {
      return whitelist.apply(null, [collection, keyWhitelist]);
    },
    concat: function () {
      return concat(collection);
    },
    where: function (keyWhitelist) {
      return where.apply(null, [collection, keyWhitelist]);
    },
  };
};

assign(objectList, {
  getByKey: getByKey,
  whitelist: whitelist,
  concat: concat
});

module.exports = objectList;
