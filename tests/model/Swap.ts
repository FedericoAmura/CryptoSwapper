import chai from 'chai';
import 'mocha';
import MockDate from 'mockdate';
import sinon from 'sinon';

const expect = chai.expect;

import Swap from '../../src/model/Swap';
import OkexService from '../../src/services/Okex.service';

describe('Swap Model', async function() {
  const NOW = new Date();
  const THIRTY_SECONDS = 30 * 1000;

  let buySwap: Swap;
  let sellSwap: Swap;

  beforeEach(async function() {
    MockDate.set(NOW);
    buySwap = new Swap('BTC-USDT', 'buy', '1000');
    sellSwap = new Swap('BTC-USDT', 'sell', '1000');
  });

  afterEach(() => {
    MockDate.reset();
    sinon.restore();
  });

  it('Should be created with pair, side and volume but not the rest', async function() {
    expect(buySwap.pair).to.equal('BTC-USDT');
    expect(buySwap.side).to.equal('buy');
    expect(buySwap.volume).to.equal('1000');
    expect(buySwap.id).to.be.undefined;
    expect(buySwap.price).to.be.undefined;
    expect(buySwap.start).to.be.undefined;
    expect(buySwap.expiration).to.be.undefined;
  });

  it('Should ask Okex for a price and have valid timeframe after requesting it', async function() {
    sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
      return {
        asks: [['36713.5', '15169', '0', '1']],
        bids: [['36687', '17171', '0', '1']],
        timestamp: NOW,
      };
    });

    await buySwap.updatePriceOffer();

    expect(buySwap.pair).to.equal('BTC-USDT');
    expect(buySwap.side).to.equal('buy');
    expect(buySwap.volume).to.equal('1000');
    expect(buySwap.id).to.be.undefined;
    expect(buySwap.providerPrice).to.equal('36713.50');
    expect(buySwap.price).to.equal('37447.77'); // providerPrice but adding fee
    expect(buySwap.start).to.eql(NOW);
    expect(buySwap.expiration).to.eql(new Date(NOW.getTime() + THIRTY_SECONDS));

    await sellSwap.updatePriceOffer();

    expect(sellSwap.pair).to.equal('BTC-USDT');
    expect(sellSwap.side).to.equal('sell');
    expect(sellSwap.volume).to.equal('1000');
    expect(sellSwap.id).to.be.undefined;
    expect(sellSwap.providerPrice).to.equal('36687.00');
    expect(sellSwap.price).to.equal('35953.26'); // providerPrice but discounting fee
    expect(sellSwap.start).to.eql(NOW);
    expect(sellSwap.expiration).to.eql(new Date(NOW.getTime() + THIRTY_SECONDS));
  });

  it('Should calculate the price properly based on the order book status', async function() {
    sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
      // 2 * 400@35000 + 0.5 * 400@36000 = 800/1000 * 35000 + 200/1000 * 36000 = 35200
      return {
        asks: [['35000', '400', '1', '3'], ['36000', '400', '0', '1'], ['40000', '400', '0', '1']],
        bids: [['34999', '10', '0', '1']],
        timestamp: NOW,
      };
    });

    await buySwap.updatePriceOffer();

    expect(buySwap.providerPrice).to.equal('35200.00');
    expect(buySwap.price).to.equal('35904.00'); // providerPrice * fee
  });
});
