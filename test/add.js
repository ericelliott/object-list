'use strict';

var
  test = require('tape'),
  list = require('../index.js');

var
  slice = [].slice;

test('.add() sync operation', function (assert) {
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

test('.add() async operation', function (assert) {
  assert.plan(4);

  var
    records = [
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
    ],
    copy = slice.call(records),

    newRecord = {
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

    result = list({
      list: records,
      async: true
    }),

    count = 0;

  result = result.add(newRecord);
  result.subscribe(
    function onNext(item) {
      assert.deepEqual(item, count ? newRecord : records[count++],
        'should contain the new record');
    },
    function onError(err) {
      assert.ok(!err, 'should not throw an error');
    },
    function onCompleted() {
      assert.ok(true, 'should call onCompleted callback');

      assert.deepEqual(records, copy,
        'should not alter original list');

      assert.end();
    }
  );
});
