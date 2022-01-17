import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import 'mocha';
import MockDate from 'mockdate'

chai.use(chaiHttp);
const expect = chai.expect;

import swapperAPI from '../../src/routes/Swapper';

describe('Swapper API', async () => {
  describe('/status', async () => {
    it('Should return status response on call', async () => {
      const request = chai.request(swapperAPI).get('/status');
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.text).to.equal('Swapper is alive');
    });
  });

  describe('/createSwapOrder', async () => {
    beforeEach(() => {
      MockDate.set(new Date());
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('Shoud return a the data for the trade order', async () => {
      const request = chai.request(swapperAPI).post('/createSwapOrder').send({
        pair: 'USDT-ETH',
        volume: '1000',
      });
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.deep.equal({
        swapId: 1,
        pair: 'USDT-ETH',
        volume: '1000',
        price: '150',
        expiration: new Date().toISOString(),
      });
    });
  });
});
