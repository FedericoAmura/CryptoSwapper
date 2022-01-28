import { Pool } from 'pg';

import postgres from './sources/Postgres';
import Swap, { SwapInterface } from '../model/Swap';

export default class SwapRepository {
  private swapper: Pool;

  constructor(source: Pool = postgres) {
    this.swapper = source;
  }

  public async getById(id: number): Promise<Swap> {
    const query = 'SELECT * FROM swapper.swap WHERE id = $1 LIMIT 1';
    const params = [id];

    const res = await this.swapper.query(query, params);

    if (!res.rows.length) {
      throw new Error(`No swap found with id ${id}`);
    }

    const dbData = res.rows[0];
    const swapData: SwapInterface = {
      id: dbData.id,
      pair: dbData.pair,
      side: dbData.side,
      volume: dbData.volume,
      providerPrice: dbData.provider_price,
      price: dbData.price,
      start: dbData.start,
      execution: dbData.execution,
      expiration: dbData.expiration,
    };

    return Swap.fromData(swapData);
  }

  public async saveSwap(swap: Swap): Promise<Swap> {
    const query = 'INSERT INTO swapper.swap (pair, side, volume, provider_price, price, start, execution, expiration) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *';
    const params = [
      swap.pair,
      swap.side,
      swap.volume,
      swap.providerPrice,
      swap.price,
      swap.start,
      swap.execution,
      swap.expiration,
    ];

    const res = await this.swapper.query(query, params);

    swap.id = res.rows[0].id;

    return swap;
  }

  public async updateSwap(swap: Swap): Promise<Swap> {
    const query = 'UPDATE swapper.swap SET execution = $1 WHERE id = $2 RETURNING *';
    const params = [
      swap.execution,
      swap.id,
    ];

    await this.swapper.query(query, params);

    // Here we should update any data that could change like updated_at

    return swap;
  }
}
