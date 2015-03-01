# object-list

Work with arrays of objects. A single object from an `object-list` is called a record.

## Status

Developer preview. I have a feeling this is duplicated effort. Please open an issue if you know of a great library for this.

## .getByKey()

Take a key name and return the first value found. Returns a single value, not an array.

### Usage

list(records).getByKey(key) -> val

```js
var val = list([
  {a: 'a'},
  {b: 'b'},
  {c: 'c'}
]).getByKey('a');

assert.equal(val, 'a',
'should return the first value it finds');

assert.equal(Array.isArray(val), false,
'should only return a single result, not an array.');

```


## .whitelist()

Take a list of keys and return a filtered list of records which contain those keys. Exclude any records that don't contain any of the whitelisted keys.

### usage

list(records).whitelist(whitelist) -> records

```js
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
```

