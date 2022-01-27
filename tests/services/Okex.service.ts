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
});
