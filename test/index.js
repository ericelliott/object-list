'use strict';

var
  test = require('tape'),
  list = require('../index.js');

var
  slice = [].slice;

test('.getByKey()', function (assert) {
  var
    records = [
      {a: 'a'},
      {b: 'b'},
      {c: 'c'}
    ],
    expected = 'a',

    copy = slice.call(records),

    val = list(records).getByKey('a');

  assert.equal(val, expected,
    'should return the first value it finds.');

  assert.equal(Array.isArray(val), false,
    'should only return a single result, not an array.');

  assert.deepEqual(records, copy,
    'should not alter original list.');

  assert.end();
});

test('.whitelist()', function (assert) {
  var
    records = [
      {a: 'a'},
      {b: 'b'},
      {c: 'c'},
      {d: 'd', a: 'a'}
    ],
    copy = slice.call(records),

    whitelisted = list(records).whitelist(['a', 'c']),

    expected = [
      {a: 'a'},
      {c: 'c'},
      {d: 'd', a: 'a'}
    ],

    missing = list(expected).getByKey('b');

  assert.deepEqual(whitelisted, expected,
    'should contain all the expected keys.');

  assert.strictEqual(missing, undefined,
    'should not contain excluded keys');

  assert.deepEqual(records, copy,
    'should not alter original list.');

  assert.end();
});

test('.concat()', function (assert) {
  var
    records = [
      {a: 'a'},
      {b: 'b'},
      {c: 'c'},
      {c: 'override'}
    ],
    copy = slice.call(records),

    record = list(records).concat(),

    expected = {
      a: 'a',
      b: 'b',
      c: 'override'
    };

  assert.deepEqual(record, expected,
    'should combine records similar to Object.assign()');

  assert.deepEqual(records, copy,
    'should not alter original list.');

  assert.end();
});
