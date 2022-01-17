import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import Api from '../model/Api';

class Swapper extends Api {
  protected routes(): void {
    this.express.use('/status', this.getSwapperStatus);
    this.express.post('/createSwapOrder', this.createSwapOrder);
  }

  // Routes
  private getSwapperStatus(req: Request, res: Response): void {
    res.status(StatusCodes.OK).send('Swapper is alive');
  }

  private createSwapOrder(req: Request, res: Response): void {
    const { pair, volume } = req.body;

    res.status(StatusCodes.OK).send({
      swapId: 1,
      pair,
      volume,
      price: '150USDT/ETH',
      expiration: new Date().toISOString(),
    });
  }
}

export default new Swapper().express;
