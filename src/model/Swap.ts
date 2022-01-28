import currency from 'currency.js';

import config from '../config';
import OkexService, { OrderBooks } from '../services/Okex.service';

export type Side = 'buy' | 'sell';

const okex = new OkexService();

export default class Swap {
  public id?: number;
  public pair: string;
  public side: Side;
  public volume: string;
  public providerPrice?: string;
  public price?: string;
  public start?: Date;
  public expiration?: Date;

  private okexService: OkexService;

  constructor(pair: string, side: Side, volume: string, okexService: OkexService = okex) {
    this.pair = pair;
    this.side = side;
    this.volume = volume;

    this.okexService = okexService;
  }

  public async updatePriceOffer(): Promise<void> {
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

    const fee = config.get(`swapper.fees.${this.side}`);

    this.providerPrice = swapPrice.format({ symbol: '', separator: '', decimal: '.'});
    this.price = swapPrice.multiply(currency(fee).divide(100).add(1)).format({ symbol: '', separator: '', decimal: '.'});
    this.start = new Date();
    this.expiration = new Date(this.start.getTime() + config.get('swapper.offerTime'));
  }
}
