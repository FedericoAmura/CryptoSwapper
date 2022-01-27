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

  let swap: Swap;

  beforeEach(async function() {
    MockDate.set(NOW);
    swap = new Swap('BTC-USDT', 'buy', '1000');
  });

  afterEach(() => {
    MockDate.reset();
    sinon.restore();
  });

  it('Should be created with pair, side and volume but not the rest', async function() {
    expect(swap.pair).to.equal('BTC-USDT');
    expect(swap.side).to.equal('buy');
    expect(swap.volume).to.equal('1000');
    expect(swap.id).to.be.undefined;
    expect(swap.price).to.be.undefined;
    expect(swap.start).to.be.undefined;
    expect(swap.expiration).to.be.undefined;
  });

  it('Should ask Okex for a price and have valid timeframe after requesting it', async function() {
    sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
      return {
        asks: [['36713.5', '15169', '0', '1']],
        bids: [['36687', '17171', '0', '1']],
        timestamp: NOW,
      };
    });

    await swap.updatePriceOffer();

    expect(swap.pair).to.equal('BTC-USDT');
    expect(swap.side).to.equal('buy');
    expect(swap.volume).to.equal('1000');
    expect(swap.id).to.be.undefined;
    expect(swap.price).to.equal('36713.50');
    expect(swap.start).to.eql(NOW);
    expect(swap.expiration).to.eql(new Date(NOW.getTime() + THIRTY_SECONDS));
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

    await swap.updatePriceOffer();

    expect(swap.price).to.equal('35200.00');
  });
});
