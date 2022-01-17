import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';

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
}
