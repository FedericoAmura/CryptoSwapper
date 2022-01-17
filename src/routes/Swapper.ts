import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

import Api from '../model/Api';

class Swapper extends Api {
  protected routes(): void {
    this.express.use('/status', this.getSwapperStatus);
    this.express.post('/createSwapOrder',
      body('pair').exists({ checkFalsy: true }).isLength({ min: 7, max: 9}),
      body('volume').exists({ checkFalsy: true }).isDecimal(),
      this.rejectErrors,
      this.createSwapOrder
    );
  }

  // Routes
  private getSwapperStatus(req: Request, res: Response): void {
    res.status(StatusCodes.OK).send('Swapper is alive');
  }

  private createSwapOrder(req: Request, res: Response): void {
    const { pair, volume } = req.body;

    res.status(StatusCodes.OK).json({
      swapId: 1,
      pair,
      volume,
      price: '150',
      expiration: new Date().toISOString(),
    });
  }
}

export default new Swapper().express;
