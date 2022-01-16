import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { StatusCodes } from 'http-status-codes';

chai.use(chaiHttp);
const expect = chai.expect;

import { createSwapperServer } from '../../src/routes/swapper';

const appServer = createSwapperServer();

describe('Swapper API', async () => {
  describe('/status', async () => {
    it('Should return status response on call', async () => {
      const request = chai.request(appServer).get('/swapper/status');
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.text).to.equal('Swapper is alive');
    });
  });
});
