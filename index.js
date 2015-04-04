'use strict';

var
  Q = require('q'),
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

  add = function add(collection, records, cb) {
    var newCollection = collection.concat(records);

    if (cb) {
      cb(null, newCollection);
      return;
    }

    return objectList(newCollection);
  },

  concat = function concat (collection) {
    return assign.apply(null, [{}].concat(collection));
  },

  where = function where (collection, query) {
    return cWhere(collection, query);
  };

var objectList = function objectList (options) {
  var
    collection,
    api = {
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
      add: function (records, cb) {
        return add.apply(null, [collection, records, cb]);
      },
      push: function () {
        return api.add.apply(null, [].slice.call(arguments));
      },
      get length () {
        return collection.length;
      }
    };

  if (options.async) {
    collection = options.list;

    var
      deferred = Q.defer(),
      promise = deferred.promise;

    api.add = lodash.partialRight(api.add, deferred.makeNodeResolver());

    api.subscribe = function (onNext, onError, onCompleted) {
      promise.then(onNext);
      promise.catch(onError);
      promise.finally(onCompleted);
    };
  } else {
    collection = options;
  }

  return api;
};

assign(objectList, {
  getByKey: getByKey,
  whitelist: whitelist,
  concat: concat,
  where: where
});

module.exports = objectList;
