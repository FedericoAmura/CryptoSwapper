import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

import OkexService from '../../src/services/Okex.service';

describe('Online - Okex Service', async function() {
  const okexService: OkexService = new OkexService();

  describe('getOrderBook', async function() {
    it('Should return the order books at a certain timestamp', async function() {
      const orderBooks = await okexService.getMarketBooks('BTC-USDT');

      expect(orderBooks).to.have.keys(['asks', 'bids', 'timestamp']);
    });
  });

  describe('placeOrder', async function() {
    it('Should place an order and return the id of it when succesful', async function() {
      const orderId = await okexService.placeOrder('BTC-USDT', 'buy', '0.01', '37500', '1234');

      expect(orderId).to.be.a('string');
    });

    it('Should throw when not able to place the order', async function() {
      try {
        await okexService.placeOrder('BTC-USDT', 'buy', '10000', '37500', '1234');
      } catch (err: unknown) {
        expect(err instanceof Error).to.be.true;
        if (err instanceof Error) {
          expect(err.message).to.equal(`Order placement failed due to insufficient balance `);
        }
      }
    });
  });
});
