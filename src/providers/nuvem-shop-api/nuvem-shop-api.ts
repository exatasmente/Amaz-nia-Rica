
import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';

/*
  Generated class for the NuvemShopApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NuvemShopApiProvider {

  constructor(public http: HTTP) {
    
  }

  public test(){
    this.http.get(' https://api.tiendanube.com/v1/626702/products', {}, {
      'Authentication':"bearer 5407bc041768d0d3f96e0e7fca683eda98f95112",
      'Content-Type': 'application/json',
      'useragent': 'AmazoniaRicaApi (lu_u_z@hotmail.com)'
    })
  .then(data => {
    console.log(JSON.parse(data.data)); 
    
  })
  .catch(error => {
    console.log(error.error); // error message as string
  });
  }
}
