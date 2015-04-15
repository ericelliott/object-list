'use strict';

var
  Rx = require('rx'),
  assert = require('assert'),
  lodash = require('lodash'),
  cWhere = require('lodash').where;

var
  assign = lodash.assign,
  getKeys = Object.keys;

var
  createObserver = function createObserver(source) {
    return function () {
      var observer = Rx.Observer.create.apply(Rx.Observer, arguments);
      return source.subscribe(observer);
    };
  };

var
  objectList,

  fnVersions = {
    sync: {
      add: function add(collection, records) {
        var newCollection = collection.concat(records);

        return objectList(newCollection);
      },
      remove: function remove(collection, record) {
        var newCollection = lodash.cloneDeep(collection);

        lodash.remove(newCollection,
          lodash.partial(lodash.isEqual, record));

        return objectList(newCollection);
      },
      removeWhere: function removeWhere(collection, query) {
        var recordsToRemove = cWhere(collection, query),
          newCollection = lodash.reject(collection,
            lodash.partial(lodash.find, recordsToRemove));

        return objectList(newCollection);
      },
      removeSlice: function removeSlice(collection, start, end) {
        var recordsToRemove = lodash.slice(collection, start, end),
          newCollection = lodash.reject(collection,
            lodash.partial(lodash.find, recordsToRemove));

        return objectList(newCollection);
      }
    },
    async: {
      add: function addAsync(collection, records) {
        var
          newCollection = objectList(collection),

          // README: this is a temporary workaround to be replaced with
          // .fromNodeCallback() or similar method when adapters get implemented
          source = Rx.Observable.from([].concat(records), function (x) {
            return objectList([x]);
          });

        newCollection.subscribe = createObserver(source);

        return newCollection;
      },
      remove: function removeAsync(collection, record) {
        var
          newCollection = objectList(collection),

          // README: this is a temporary workaround to be replaced with
          // .fromNodeCallback() or similar method when adapters get implemented
          source = Rx.Observable.from([].concat(record), function (x) {
            return fnVersions.sync.remove(collection, x);
          });

        newCollection.subscribe = createObserver(source);

        return newCollection;
      },
      removeWhere: function removeWhereAsync(collection, query) {
        var
          newCollection = objectList(collection),

          // README: this is a temporary workaround to be replaced with
          // .fromNodeCallback() or similar method when adapters get implemented
          source = Rx.Observable.from([fnVersions.sync.removeWhere(collection, query)]);

        newCollection.subscribe = createObserver(source);

        return newCollection;
      },
      removeSlice: function removeSliceAsync(collection, query) {
        var
          newCollection = objectList(collection),

          // README: this is a temporary workaround to be replaced with
          // .fromNodeCallback() or similar method when adapters get implemented
          source = Rx.Observable.from([fnVersions.sync.removeSlice(collection, query)]);

        newCollection.subscribe = createObserver(source);

        return newCollection;
      }
    }
  },

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

  where = function where (collection, query) {
    return cWhere(collection, query);
  };

objectList = function objectList (options) {
  var
    collection = options.async ? options.list : options,
    version = options.async ? 'async' : 'sync',

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
        return fnVersions[version].add.apply(null, [collection, records]);
      },
      push: function () {
        return api.add.apply(null, arguments);
      },
      remove: function (records) {
        return fnVersions[version].remove.apply(null, [collection, records]);
      },
      removeWhere: function (query) {
        return fnVersions[version].removeWhere.apply(null, [collection, query]);
      },
      removeSlice: function (start, end) {
        return fnVersions[version].removeSlice.apply(null, [collection, start, end]);
      },
      toArray: function () {
        return lodash.cloneDeep(collection);
      },
      get length () {
        return collection.length;
      }
    };

  return api;
};

assign(objectList, {
  getByKey: getByKey,
  whitelist: whitelist,
  concat: concat,
  where: where
});

module.exports = objectList;
