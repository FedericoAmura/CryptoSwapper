import chai from 'chai';
import 'mocha';
import sinon from 'sinon';

const expect = chai.expect;

import Swap from '../../src/model/Swap';
import SwapRepository from '../../src/repositories/Swap.repository';
import OkexService from '../../src/services/Okex.service';

describe('Swap Repository', async function() {
  const NOW = new Date();

  const swapRepository: SwapRepository = new SwapRepository();
  let swap: Swap;

  beforeEach(async function() {
    sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
      return {
        asks: [['36713.5', '15169', '0', '1']],
        bids: [['36687', '17171', '0', '1']],
        timestamp: NOW,
      };
    });
    swap = new Swap('BTC-USDT', 'buy', '1000');
    await swap.updatePriceOffer();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('saveSwap', async function() {
    it('should add the id to the swap after saving it', async function() {
      expect(swap.id).to.be.undefined;

      await swapRepository.saveSwap(swap);

      expect(swap.id).to.equal(1);
    });
  });
});
