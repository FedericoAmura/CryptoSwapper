import { expect } from 'chai';
import 'mocha';
import MockDate from 'mockdate';
import sinon, { SinonSpy } from 'sinon';

import Swap from '../../src/model/Swap';
import SwapRepository from '../../src/repositories/Swap.repository';
import OkexService from '../../src/services/Okex.service';
import postgres from '../../src/repositories/sources/Postgres';

describe('Swap Repository', async function() {
  const NOW = new Date();
  const THIRTY_SECONDS = 30 * 1000;

  let dbSpy: SinonSpy;
  const swapRepository: SwapRepository = new SwapRepository();
  let swap: Swap;

  before(async function() {
    await postgres.query('TRUNCATE swapper.swap');
    await postgres.query('ALTER SEQUENCE swapper.swap_id_seq RESTART WITH 1');
  });

  beforeEach(async function() {
    MockDate.set(NOW);
    dbSpy = sinon.spy(postgres, 'query');
    sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
      return {
        asks: [['36713.5', '15169', '0', '1']],
        bids: [['36687', '17171', '0', '1']],
        timestamp: NOW,
      };
    });
    sinon.stub(OkexService.prototype, 'placeOrder').callsFake(async () => {
      return '312269865356374016';
    });
    swap = new Swap('BTC-USDT', 'buy', '1000');
    await swap.updatePriceOffer();
    await swap.executeSwap();
  });

  afterEach(async function() {
    MockDate.reset();
    sinon.restore();
    await postgres.query('TRUNCATE swapper.swap');
    await postgres.query('ALTER SEQUENCE swapper.swap_id_seq RESTART WITH 1');
  });

  describe('getById', async function() {
    beforeEach(async function() {
      dbSpy.resetHistory();
    });

    it('Should get the specified swap from the db', async function() {
      await swapRepository.saveSwap(swap);

      // @ts-ignore
      const savedSwap = await swapRepository.getById(swap.id);

      expect(dbSpy.callCount).to.equal(2);

      expect(savedSwap.id).to.equal(1);
      expect(savedSwap.pair).to.equal('BTC-USDT');
      expect(savedSwap.side).to.equal('buy');
      expect(savedSwap.volume).to.equal('1000');
      expect(savedSwap.providerPrice).to.equal('36713.50');
      expect(savedSwap.price).to.equal('37447.77');
      expect(savedSwap.orderId).to.equal('312269865356374016');
      expect(savedSwap.start).to.eql(NOW);
      expect(savedSwap.execution).to.eql(NOW);
      expect(savedSwap.expiration).to.eql(new Date(NOW.getTime() + THIRTY_SECONDS));
    });

    it('Should throw when the swap cannot be found', async function() {
      const swapId = 12312135;
      try {
        await swapRepository.getById(swapId);
      } catch (err: unknown) {
        expect(dbSpy.calledOnce).to.be.true;

        expect(err instanceof Error).to.be.true;
        if (err instanceof Error) {
          expect(err.message).to.equal(`No swap found with id ${swapId}`);
        }
      }
    });
  });

  describe('saveSwap', async function() {
    it('Should add the id to the swap after saving it and also return it', async function() {
      expect(swap.id).to.be.undefined;

      const savedSwap = await swapRepository.saveSwap(swap);

      expect(dbSpy.calledOnce).to.be.true;

      expect(swap.id).to.equal(1);
      expect(savedSwap.id).to.equal(1);
    });
  });

  describe('updateSwap', async function() {
    it('Should update the swap in the db', async function() {
      const savedSwap = await swapRepository.saveSwap(swap);

      await savedSwap.executeSwap();

      await swapRepository.updateSwap(savedSwap);

      expect(dbSpy.callCount).to.equal(2);
    });
  });
});
