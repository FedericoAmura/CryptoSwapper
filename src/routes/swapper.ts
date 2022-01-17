import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class Swapper {
  public express: Express;

  constructor() {
    this.express = express();
    this.routes();
  }

  private routes(): void {
    this.express.use('/status', this.getSwapperStatus);
  }

  // Routes
  private getSwapperStatus(req: Request, res: Response): void {
    res.status(StatusCodes.OK).send('Swapper is alive');
  }
}

export default new Swapper().express;
