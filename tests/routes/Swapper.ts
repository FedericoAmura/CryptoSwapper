import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import 'mocha';
import MockDate from 'mockdate'
import sinon from 'sinon';

chai.use(chaiHttp);
const expect = chai.expect;

import swapperAPI from '../../src/routes/Swapper';
import OkexService from '../../src/services/Okex.service';

describe('Swapper API', async function() {
  describe('/status', async function() {
    it('Should return status response on call', async function() {
      const request = chai.request(swapperAPI).get('/status');
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.text).to.equal('Swapper is alive');
    });
  });

  describe('/createSwapOrder', async function() {
    const NOW = new Date();
    const THIRTY_SECONDS = 30 * 1000;

    beforeEach(() => {
      MockDate.set(NOW);
    });

    afterEach(() => {
      MockDate.reset();
      sinon.restore();
    });

    it('Should return a the data for the trade order', async function() {
      sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
        return {
          asks: [['36713.5', '15169', '0', '1']],
          bids: [['36687', '17171', '0', '1']],
          timestamp: NOW,
        };
      });

      const request = chai.request(swapperAPI).post('/createSwapOrder').send({
        pair: 'BTC-USDT',
        side: 'buy',
        volume: '1000',
      });
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.have.own.property('id');
      expect(response.body).to.deep.include({
        pair: 'BTC-USDT',
        side: 'buy',
        volume: '1000',
        price: '36713.50',
        start: NOW.toISOString(),
        expiration: new Date(NOW.getTime() + THIRTY_SECONDS).toISOString(),
      });
    });

    it('Should return an error when there are not enough orders to fulfill the request', async function() {
      sinon.stub(OkexService.prototype, 'getMarketBooks').callsFake(async () => {
        return {
          asks: [['36713.5', '15', '0', '1']],
          bids: [['36687', '17', '0', '1']],
          timestamp: NOW,
        };
      });

      const request = chai.request(swapperAPI).post('/createSwapOrder').send({
        pair: 'BTC-USDT',
        side: 'buy',
        volume: '1000',
      });
      const response = await request;

      expect(response.status).to.equal(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).to.deep.include({
        status: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Not enough orders to fulfill the swap',
      });
    });
  });
});
