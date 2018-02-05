import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WooProvider {
  wooCommerce : any;
  constructor() {
    this.wooCommerce = WC({
      url:"http://amazoniarica.store/api",
      consumerKey:"ck_001788083c0242f737be6e77560a01e4e779b7b7",
      consumerSecret:"cs_81123f40e617c475c750714a22cdefe6cb38959c",
      wpAPI: true,
      version: 'wc/v2'
    });
  }
  init(){
    return this.wooCommerce;
  }
  status(value) {
    let val = {
      'pending': 'Pendente',
      'processing': 'Processando',
      'on-hold': 'Em Espera',
      'completed': 'Finalizada',
      'cancelled': 'Cancelado',
      'refunded': 'Reembolsado',
      'failed': 'Falha'
    }
    return val[value];
  }
 
}
