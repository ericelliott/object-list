# Future

## How should we trigger async?

By default, the methods should be sync so that you can easily replace arrays with object-lists, but since a lot of what we do in JS is async, it should be trivial to trigger async mode and magically be compatible with infinite streams, generators, asyncronous event listeners, and so on.


### 'async' flag

Normally, methods are synchronous:

```js
let myList = list([{a: 1}, {b: 2}, {c: 3}])
  .reverse(); // [{c: 3}, {b: 2}, {a: 1}]
```

But what happens when you're dealing with asynchronous data sources?

```js
let myList = list({ list: apiResource, async: true })
  .reverse()
  .subscribe(onNext, onError, onCompleted);
```

When you pass in a siren-resource object, an API error (such as 400 - 500 range status codes) should trigger `onError()` instead of `onNext()`, so it should probably throw an error if you omit the `onError()` handler. If you don't want anything to happen, pass in a no-op function.

Let's pass a lambda into the next handler:

```js
// apiResource normally returns [{a: 1}, {b: 2}, {c: 3}]
// for GET operation
let myList = list({ list: apiResource, async: true })
  .reverse()
  .subscribe(function onNext(item) {
    console.log(item);
  }, onError, onCompleted);

// {"c":3}
// {"b":2}
// {"a":1}
```


## Method Ideas

* All of ES6 `Array.prototype`, spec compatible.
* `.push(record)`, `.add(record)` - Append the record to the list.
* `.remove(obj)` – Removes an item from the collection if it looks like the passed-in object (deepEqual).
* `.removeWhere({key1: value, key2: value2...})` - Remove all objects that match the key:value where clauses.
* `.removeSlice(startIndex, endIndex)` – Filter out a range of indexes. Basically the opposite of `.slice()` (return the filtered list instead of the sliced out subset).
* `.distinct(predicate)` - Returns only distinct records which satisfy the predicate function.
* `.distinctWhere({key: value, key2: value2})` - Returns only distinct records which match all supplied where clauses.
* `.sortBy({foo: 'descending'}, [fn])` – Sorts the list based on the property passed in using optional `[].sort()` compatible custom sort function.
* `.at(index)`, `.recordAt(index)` – Returns the record at `index`.
* `.minBy('key', [fn])` - Return min record by key value using optional `[].sort()` compatible custom sort function.
* `.maxBy('key', [fn])` - Return max record by key value using optional `[].sort()` compatible custom sort function.
* `.orDefault(defaultList)` - Returns the list it receives, unless that list is empty, in which case it returns the default list passed in.
* `.first()` - Alias of `.find()`.
* `.last()` - Like `.first()` / `.find()`, but return the last matching record.
* `.head([n])` - Return the first record or first `n` records.
* `.tail([n])` - Return the last record, or last `n` records.
* `.reverse()` - Return the whole list in reverse order (last to first).
* `.loop([cycles])` - Returns all values and then starts over from the beginning to produce an infinitely repeating stream. Will cause an infinite loop if `cylces` is omitted.
* `.pingPong([cycles])` - Like loop, but when it reaches the end, it reverses order and plays back values from last to first. When it reaches the beginning, it reverses order again and plays back values from first to last... Will cause an infinite loop if `cylces` is omitted.
* `.repeat(records [, n])` - Repeat supplied records `n` times.
* `.skip(n, [firstIndex])` - Returns a list of one record for every n records. `firstIndex` defaults to 0. For instance, `list([a, b, c, d, e, f, g]).skip(2)` returns `list([a, d, g])`.
* `.includes()` – Currently experimental for [`Array.prototype` (ES7)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes). See [`lodash .includes()`](https://lodash.com/docs#includes).
* `.count()` - Basically like `[].length`. Also support `[].length` with getter for array compat.
* `.toJSON()` – A safe `JSON.stringify()` that does not throw. See [json-stringify-safe](https://github.com/isaacs/json-stringify-safe). Pass in `{ canThrow: true }`
* `.toArray()` - Return as Array.
* `.toImmutable()` - Return as Immutable.List.
* `.toObservable()` - Return as RxJS Observable.
* `.toGenerator()` - Return ES6 generator function if runtime supports it.
* `.toNodeStream()` - Return collection as a Node stream.
* `.pipe(nodeStream, options)` - Shorthand for `.toNodeStream().pipe(nodeStream, options)`

