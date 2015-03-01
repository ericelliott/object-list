'use strict';

var
  test = require('tape'),
  list = require('../index.js');

test('.getByKey()', function (assert) {
  var val = list([
      {a: 'a'},
      {b: 'b'},
      {c: 'c'}
    ]).getByKey('a');

  assert.equal(val, 'a',
    'should return the first value it finds');

  assert.equal(Array.isArray(val), false,
    'should only return a single result, not an array.');

  assert.end();
});

test('.whitelist()', function (assert) {
  var whitelisted = list([
      {a: 'a'},
      {b: 'b'},
      {c: 'c'},
      {d: 'd', a: 'a'}
    ]).whitelist(['a', 'c']),

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

  assert.end();
});
