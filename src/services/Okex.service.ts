import axios, { AxiosInstance, Method } from 'axios';
import CryptoJS from 'crypto-js';

import config from '../config';
const okexConfig = config.get('okex');

export type Order = [string, string, string, string]; // price, volume, liquidated, amount

export interface OrderBooks {
  asks: Order[];
  bids: Order[];
  timestamp: Date;
}

export default class OkexService {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: okexConfig.url,
      headers: {
        'x-simulated-trading': okexConfig.simulatedTrading,
        'OK-ACCESS-KEY': okexConfig.accessKey,
        'OK-ACCESS-PASSPHRASE': okexConfig.accessPassphrase,
      },
    });
  }

  private async makeRequest(method: Method, url: string, params?: any, body?: any) {
    const now = new Date();
    const timestamp = now.toISOString();

    const secretKey = okexConfig.secretKey;
    const signature = timestamp + method + url + (body ? JSON.stringify(body) : '');
    const hmac = CryptoJS.HmacSHA256(signature, secretKey);
    const signed = CryptoJS.enc.Base64.stringify(hmac);

    return this.axios.request({
      method,
      url,
      headers: {
        'OK-ACCESS-TIMESTAMP': timestamp,
        'OK-ACCESS-SIGN': signed,
      },
      params,
      data: body,
    });
  }

  public async getMarketBooks(pair: string): Promise<OrderBooks> {
    const method: Method = 'GET';
    const url = '/api/v5/market/books';
    const params = {
      instId: pair,
      // TODO make sz a parameter and use it in increasing steps until we have enough to fulfill the requested volume
      // This way it avoids requesting so much data without needing it
      sz: 200,
    };

    const response = await this.makeRequest(method, url, params);

    const { asks, bids, ts } = response.data.data[0];

    return { asks, bids, timestamp: new Date(Number(ts)) };
  }

  public async placeOrder(pair: string, side: string, amount: string, price: string, orderId?: string): Promise<string> {
    const method: Method = 'POST';
    const url = '/api/v5/trade/order';
    const body = {
      instId: pair,
      tdMode: 'cash',
      side,
      clOrdId: orderId,
      ordType: 'fok',
      sz: amount,
      px: price,
    };

    const response = await this.makeRequest(method, url, null, body);

    const { ordId, sCode, sMsg } = response.data.data[0];

    if (sMsg) {
      console.error(`Okx error ${sCode}: ${sMsg}`);
      throw new Error(sMsg);
    }

    return ordId;
  }
}
