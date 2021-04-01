'use strict';

const log = require('../middleware/log.js');

describe("CAPS functionality", () => {

  let payload = {
    storeName: 'Generic Store Name',
    storeId: '123456',
    orderID: '456789',
    customerName: 'Jane Doe',
    address: '21 Elm Street',
  };

  let pickup = { 'event': 'pickup' };
  let inTransit = { 'event': 'in-transit' };
  let delivered = { 'event': 'delivered' };
  let spy;

  beforeEach(()=> {
    spy = jest.spyOn(console, 'log').mockImplementation();
  })

  afterEach(() => {
    jest.resetAllMocks();
  })

  test('that the log function logs when called on PICKUP', () => {
    log(payload, pickup);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  })

  test('that the log function logs when called on INTRANSIT', () => {
    log(payload, inTransit);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  })

  test('that the log function logs when called on DELIVERY', () => {
    log(payload, delivered);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  })

})
