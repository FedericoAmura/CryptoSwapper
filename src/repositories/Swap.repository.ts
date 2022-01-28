import { Pool } from 'pg';

import postgres from './sources/Postgres';
import Swap from '../model/Swap';

export default class SwapRepository {
  private swapper: Pool;

  constructor(source: Pool = postgres) {
    this.swapper = source;
  }

  public async saveSwap(swap: Swap): Promise<Swap> {
    const query = 'INSERT INTO swapper.swap (pair, side, volume, providerPrice, price, start, expiration) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
    const params = [
      swap.pair,
      swap.side,
      swap.volume,
      swap.providerPrice,
      swap.price,
      swap.start,
      swap.expiration,
    ];

    const res = await this.swapper.query(query, params);

    swap.id = res.rows[0].id;

    return swap;
  }
}
