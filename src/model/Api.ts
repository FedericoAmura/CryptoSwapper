import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';

export default abstract class Api {
  public express: Express;

  constructor() {
    this.express = express();
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    this.routes();
  }

  protected abstract routes(): void;

  protected rejectErrors(req: Request, res: Response, next: NextFunction): void {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
      throw new Error('Bad request');
    }
    next();
  }
}
