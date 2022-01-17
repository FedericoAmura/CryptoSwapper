import chai from 'chai';
import chaiHttp from 'chai-http';
import { StatusCodes } from 'http-status-codes';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

import swapperAPI from '../../src/routes/swapper';

describe('Swapper API', async () => {
  describe('/status', async () => {
    it('Should return status response on call', async () => {
      const request = chai.request(swapperAPI).get('/status');
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.text).to.equal('Swapper is alive');
    });
  });
});
