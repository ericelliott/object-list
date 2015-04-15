'use strict';

var
  test = require('tape'),
  list = require('../index.js');

var
  slice = [].slice;

test('.remove() sync operation', function (assert) {
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
        "id": "ci6r6aliv00008poxc2zgnjvf",
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
      "id": "ci6r6aliv00008poxc2zgnjvf",
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

    result = list(records).remove(record),

    actual = result.where({ id: 'ci6r6aliv00008poxc2zgnjvf' })[0];

  assert.deepEqual(actual, undefined,
    'should not contain the removed record');

  assert.deepEqual(records, copy,
    'should not alter original list');

  assert.end();
});

test('.remove() async operation', function (assert) {
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
      },
      {
        "id": "ci6r6aliv00008poxc2zgnjvf",
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
      "id": "ci6r6aliv00008poxc2zgnjvf",
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

    result = list({
      list: records,
      async: true
    });

  result = result.remove(record);
  result.subscribe(
    function onNext(item) {
      assert.notDeepEqual(item, record,
        'should not contain the removed record');
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

test('.removeWhere() sync operation', function (assert) {
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
        "id": "ci6r6aliv00008poxc2zgnjvf",
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

    query = {
      "lastName": "Chambers",
    },

    result = list(records).removeWhere(query),

    actual = result.where({ lastName: 'Chambers' })[0];

  assert.deepEqual(actual, undefined,
    'should not contain the removed record');

  assert.deepEqual(records, copy,
    'should not alter original list');

  assert.end();
});

test('.removeWhere() async operation', function (assert) {
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
      },
      {
        "id": "ci6r6aliv00008poxc2zgnjvf",
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

    query = {
      "lastName": "Chambers",
    },

    result = list({
      list: records,
      async: true
    });

  result = result.removeWhere(query);
  result.subscribe(
    function onNext(item) {
      assert.notDeepEqual(item, records[0],
        'should not contain the removed record');

      assert.notDeepEqual(item, records[2],
        'should not contain the removed record');
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

test('.removeSlice() sync operation', function (assert) {
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
        "id": "ci6r6aliv00008poxc2zgnjvf",
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

    result = list(records).removeSlice(1, 2),

    actual = result.where({ id: 'ci6r6aliv00008poxc2zgnjvf' })[0];

  assert.deepEqual(actual, undefined,
    'should not contain the removed record');

  assert.ok(result.length < copy.length,
    'result should have less records than copy');

  assert.deepEqual(records, copy,
    'should not alter original list');

  assert.end();
});

test('.removeSlice() async operation', function (assert) {
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
      },
      {
        "id": "ci6r6aliv00008poxc2zgnjvf",
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

    result = list({
      list: records,
      async: true
    });

  result = result.removeSlice(1, 2);
  result.subscribe(
    function onNext(item) {
      assert.notDeepEqual(item, records[1],
        'should not contain the removed record');
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
