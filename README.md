# object-list

Treat arrays of objects like a db you can query. A single object from an `object-list` is called a record.

## A common API for object collections

You may be scratching your head right now and wondering how this is different from Underscore, Lodash, or Rx Observables. Astute observations. The implementation will likely lean heavily on both Lodash and Rx Observables.

The difference is that this is intended to provide a universal facade for many types of object collections. It is an interface contract that will hopefully support a number of modular collection adapters. Read on for more details.


## Status

Developer preview.


## API Design Goals

Only a few of these design goals have been met in the current implementation, so read this section like everything is prefixed with "eventually..." See [future](https://github.com/ericelliott/object-list/blob/master/docs/future.md).

* A common API for object collections (e.g. arrays of objects). Adapters for:
  - Array
  - Immutable.js List
  - Rx Observable
  - Siren-Resource API
  - Mongo client
  - Redis client
* object-lists are immutable. Instead of mutating the source data, a new object-list will be returned.
* Completely modular. Enable `require()` at the function level similar to `require('lodash/object/assign')`, etc... Compatibility transforms for things that aren't required for hard dependencies should also be separate modules. Minimize browserify bundle weight.
* Node or Browser.
* Provide ES6 `Array.prototype` compatible API. Almost anything that takes an array as input should be able to take an object-list, as well, provided the API does not rely on array mutation.
* Use ES6 and make compiled ES5 version available on npm.
* Compatible with infinite streams and generators.
* Should be capable of sync or async. Add `.subscribe()` method for async results.


## Getting Started

Install:

```
$ npm install object-list
```

Use:

```js
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


## .where()

Select all records which match the given predicate pair.

### Usage

list(records).where({key: value}) -> records

```js
// Find all orders by customer email
var records = [
    {
      "id": "ci6r6aliv00007poxc2zgnjvf",
      "date": "2014-12-30 05:29:28",
      "billingEmail": "dennis@example.com",
      "firstName": "Dennis",
      "lastName": "Chambers",
      "lineItems": {
        "name": "Zildjian K Custom Organic Ride - 21\"",
        "sku": "h617xrh",
        "quantity": "1",
        "total": "379.95"
      }
    },
    {
      "id": "ci6r6aliv00007poxc2zgnjvf",
      "date": "2014-12-30 05:29:28",
      "billingEmail": "carlos@example.com",
      "firstName": "Carlos",
      "lastName": "Santana",
      "lineItems": {
        "name": "Gibson Memphis 1963 ES-335 TD - '60s Cherry 2014",
        "sku": "sc37x3m",
        "quantity": "1",
        "total": "3999.00"
      }
    },
    {
      "id": "ci6r6aliv00007poxc2zgnjvf",
      "date": "2014-12-30 05:29:28",
      "billingEmail": "dennis@example.com",
      "firstName": "Dennis",
      "lastName": "Chambers",
      "lineItems": {
        "name": "DW Collector's Series Metal Snare - 6.5\"x14\" Titanium 1mm",
        "sku": "sc37x3m",
        "quantity": "1",
        "total": "379.95"
      }
    }
  ],
  copy = slice.call(records),

  result = list(records).where({
    billingEmail: 'dennis@example.com'
  }),

  expected = [
    {
      "id": "ci6r6aliv00007poxc2zgnjvf",
      "date": "2014-12-30 05:29:28",
      "billingEmail": "dennis@example.com",
      "firstName": "Dennis",
      "lastName": "Chambers",
      "lineItems": {
        "name": "Zildjian K Custom Organic Ride - 21\"",
        "sku": "h617xrh",
        "quantity": "1",
        "total": "379.95"
      }
    },
    {
      "id": "ci6r6aliv00007poxc2zgnjvf",
      "date": "2014-12-30 05:29:28",
      "billingEmail": "dennis@example.com",
      "firstName": "Dennis",
      "lastName": "Chambers",
      "lineItems": {
        "name": "DW Collector's Series Metal Snare - 6.5\"x14\" Titanium 1mm",
        "sku": "sc37x3m",
        "quantity": "1",
        "total": "379.95"
      }
    }
  ];


assert.deepEqual(result, expected,
  'should contain all the expected records.');

assert.equal(result.length, 2,
  'should not contain excluded records.');

assert.deepEqual(records, copy,
  'should not alter original list.');
```


## Courses

This was written for the ["Learn JavaScript with Eric Elliott"](https://ericelliottjs.com/) course series.

Students will get a series of short videos, lots of interactive lessons explaining concepts in-depth, the ability to help and learn from each other, and a lot more.

Here's a sneak peek at our members-only site:

![Course homepage](https://cloud.githubusercontent.com/assets/364727/6434012/b3ff7a04-c03b-11e4-9b33-51889c74036f.png)

![Student profile](https://cloud.githubusercontent.com/assets/364727/6434016/c7a0b802-c03b-11e4-9f4b-867464bd88c6.png)


# [Learn JavaScript](https://ericelliottjs.com/)
