import express, { Express, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

function getSwapperStatus(req: Request, res: Response) {
  res.status(StatusCodes.OK).send('Swapper is alive');
}

export function createSwapperServer(): Express {
  const appServer: Express = express();

  // Routes loading
  appServer.get('/swapper/status', getSwapperStatus);

  return appServer;
}
