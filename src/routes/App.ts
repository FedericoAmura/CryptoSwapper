import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import Api from '../model/Api';

import config from '../config';
import swapperAPI from '../routes/Swapper';

const ENV: string = config.get('env');

class App extends Api {
  protected routes(): void {
    this.express.use('/status', this.status)
    this.express.use('/swapper', swapperAPI);
  }

  // Routes
  private status(req: Request, res: Response): void {
    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      environment: ENV,
    });
  }
}

export default new App().express;
