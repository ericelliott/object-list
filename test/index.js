'use strict';

// var skip = function () {};

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


test('.where() single clause', function (assert) {
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

  assert.end();
});


test('.where() multiple clause', function (assert) {
  // Find the order where Dennis ordered a cymbal.
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
      billingEmail: 'dennis@example.com',
      lineItems: {
        sku: 'h617xrh'
      }
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
      }
    ];

  assert.deepEqual(result, expected,
    'should contain all the expected records.');

  assert.equal(result.length, 1,
    'should not contain excluded records.');

  assert.deepEqual(records, copy,
    'should not alter original list.');

  assert.end();
});

test('.add() records to list', function (assert) {
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

    record = {
      id: 'ci6r6aliv00008poxc2zgnjvf',
      date: '2014-12-30 05:29:28',
      billingEmail: 'dennis@example.com',
      firstName: 'Dennis',
      lastName: 'Chambers',
      lineItems: {
        name: 'Zildjian K Custom Organic Ride - 21"',
        sku: 'h123xrh',
        quantity: '1',
        total: '379.95'
      }
    },

    result = list(records).add(record),

    expected = result.where({ id: 'ci6r6aliv00008poxc2zgnjvf' })[0];

  assert.deepEqual(record, expected,
    'should contain the new record');

  assert.deepEqual(records, copy,
    'should not alter original list');

  assert.end();
});
