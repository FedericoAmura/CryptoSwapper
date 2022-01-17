import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import config from './config';
import swapperAPI from './routes/swapper';

const PORT: number = config.get('port');
const ENV: string = config.get('env');

class API {
  public express: Express;

  constructor() {
    this.express = express();
    this.routes();
  }

  private routes(): void {
    this.express.use(helmet());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cors());

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

const api = new API();
api.express.listen(PORT, () => {
  console.log(`⚡️[server]: API is running at http://localhost:${PORT}`);
});

export default api.express;
