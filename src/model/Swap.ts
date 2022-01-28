import currency from 'currency.js';

import config from '../config';
import OkexService, { OrderBooks } from '../services/Okex.service';

export type Side = 'buy' | 'sell';

const okex = new OkexService();

export interface SwapInterface {
  id?: number;
  pair: string;
  side: Side;
  volume: string;
  providerPrice?: string;
  price?: string;
  start?: Date;
  execution?: Date;
  expiration?: Date;
}

export default class Swap implements SwapInterface {
  public id?: number;
  public pair: string;
  public side: Side;
  public volume: string;
  public providerPrice?: string;
  public price?: string;
  public start?: Date;
  public execution?: Date;
  public expiration?: Date;

  private okexService: OkexService;

  constructor(pair: string, side: Side, volume: string, okexService: OkexService = okex) {
    this.pair = pair;
    this.side = side;
    this.volume = volume;

    this.okexService = okexService;
  }

  public static fromData(data: SwapInterface): Swap {
    const swap = new Swap(data.pair, data.side, data.volume);
    swap.id = data.id;
    swap.providerPrice = data.providerPrice;
    swap.price = data.price;
    swap.start = data.start;
    swap.execution = data.execution;
    swap.expiration = data.expiration;

    return swap;
  }

  private applySwapFee(providerPrice: currency): currency {
    const fee = config.get(`swapper.fees.${this.side}`);

    const feeFactor = (this.side === 'buy' ? currency(100).add(fee) : currency(100).subtract(fee)).divide(100);

    return providerPrice.multiply(feeFactor);
  }

  public async updatePriceOffer(): Promise<void> {
    if (this.start || this.execution || this.expiration) {
      throw new Error('Swap has already been priced.');
    }

    const orderbooks: OrderBooks = await this.okexService.getMarketBooks(this.pair);

    const orders = this.side === 'buy' ? orderbooks.asks : orderbooks.bids;
    const swapVolume: currency = currency(this.volume);
    let swapPrice: currency = currency(0);

    let iVolume: currency = currency(0);
    for (let i = 0; i < orders.length; i++) {
      const [orderPrice, orderSize, liquidatedOrders, amountOrders] = orders[i].map(v => new currency(v));

      const orderVolume: currency = orderSize.multiply(amountOrders.subtract(liquidatedOrders));
      const remainingVolume: currency = swapVolume.subtract(iVolume);

      // @ts-ignore
      const buyAllOrder: boolean = remainingVolume.subtract(orderVolume).value > 0;
      const boughtVolume: currency = buyAllOrder ? orderVolume : remainingVolume;

      swapPrice = swapPrice.add(orderPrice.multiply(boughtVolume.divide(swapVolume)));

      iVolume = iVolume.add(boughtVolume);
      if (!buyAllOrder) {
        break; // We already completed the order volume, no need to keep iterating
      }
    }
    // @ts-ignore
    if (swapVolume.subtract(iVolume).value > 0) {
      throw new Error('Not enough orders to fulfill the swap');
    }

    this.providerPrice = swapPrice.format({ symbol: '', separator: '', decimal: '.'});
    this.price = this.applySwapFee(swapPrice).format({ symbol: '', separator: '', decimal: '.'});
    this.start = new Date();
    this.expiration = new Date(this.start.getTime() + config.get('swapper.offerTime'));
  }

  public async executeSwap(): Promise<void> {
    const now = new Date();

    if (!this.start || !this.expiration) {
      throw new Error('Swap has never been priced. It cannot be executed.');
    }
    if (now > this.expiration) {
      throw new Error('Swap has expired. It cannot be executed.');
    }

    // TODO execute the swap on Okex

    this.execution = now;
  };
}
