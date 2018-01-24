import { Injectable } from '@angular/core';
import * as WC from 'woocommerce-api';

@Injectable()
export class WooProvider {
  wooCommerce : any;
  constructor() {
    this.wooCommerce = WC({
      url:"http://paranoidlab.xyz/amazoniarica/",
      consumerKey:"ck_96a8b9b00a27b30508ce7d300df990d489e1b5d8",
      consumerSecret:"cs_0e9ab93f40e26ac82febf970ea6c1138223b5488"
      
    });
  }
  init(){
    return this.wooCommerce;
  }
}
