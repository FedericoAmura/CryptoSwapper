import chai from 'chai';
import chaiHttp from 'chai-http';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

import api from '../../src/routes/App';

describe('Server API', async function() {
  describe('/status', async function() {
    it('Should return status response on call', async function() {
      const request = chai.request(api).get('/status');
      const response = await request;

      expect(response.status).to.equal(StatusCodes.OK);
      expect(response.body).to.deep.equal({
        status: ReasonPhrases.OK,
        environment: 'test',
      });
    });
  });
});
