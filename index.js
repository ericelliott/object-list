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
  subbable = function subbable(promise) {
    return function (onNext, onError, onCompleted) {
      promise.then(onNext);
      promise.catch(onError);
      promise.finally(onCompleted);
    };
  };

var
  objectList,

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

  add = function add(collection, records) {
    var newCollection = collection.concat(records);

    return objectList(newCollection);
  },

  addAsync = function addAsync(collection, records, cb) {
    var
      deferred = Q.defer(),
      promise = deferred.promise,

      newCollection = objectList(collection);

    // README: the following operation would be invoked from the callback for
    // the async operation, when adapters get implemented
    deferred.resolve(add(collection, records));

    newCollection.subscribe = subbable(promise);

    return newCollection;
  },

  concat = function concat (collection) {
    return assign.apply(null, [{}].concat(collection));
  },

  where = function where (collection, query) {
    return cWhere(collection, query);
  };

objectList = function objectList (options) {
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
      add: function (records) {
        return add.apply(null, [collection, records]);
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

    api.add = addAsync.bind(null, collection);
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
