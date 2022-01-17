import chai from 'chai';
import chaiHttp from 'chai-http';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

import api from '../src/api';

describe('Server API', async () => {
  describe('/status', async () => {
    const request = chai.request(api).get('/status');
    const response = await request;

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.text).to.equal({
      status: ReasonPhrases.OK,
      environment: 'test',
    });
  });
});
