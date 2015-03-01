# object-list

Work with arrays of objects. A single object from an `object-list` is called a record.

## Status

Developer preview. I have a feeling this is duplicated effort. Please open an issue if you know of a great library for this.

## Getting Started

Install:

```
$ npm install object-list
```

Use:

```
var list = require('object-list');

var records = [{a: 'a'}, {b: 'b'},{c: 'c'}];

list(records).getByKey('a'); // -> 'a'
```


## .getByKey()

Take a key name and return the first value found. Returns a single value, not an array.

### Usage

list(records).getByKey(key) -> val

```js
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
```


## .whitelist()

Take a list of keys and return a filtered list of records which contain those keys. Exclude any records that don't contain any of the whitelisted keys.

### Usage

list(records).whitelist(whitelist) -> records

```js
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
```


## .concat()

Mix a list into a single record.

### Usage

list(records).concat() -> record

```js
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
```

