import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../menu/menu';
import { MyApp } from '../../app/app.component';

@Component({
  selector: 'page-checkout-modal',
  templateUrl: 'checkout-modal.html',
})
export class CheckoutModalPage {
  data: any;
  boleto: any;
  userInfo: any;
  status : any;
  constructor(public storage: Storage, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get('data');
    this.status = "processing";
    this.http.get("http://paranoidlab.xyz/amazoniarica/api.php?opt=getTransaction&code="+this.data.code).subscribe( resp =>{
      let pagseguro = resp.json();

      this.data = pagseguro;
      console.log(this.data);
      if(pagseguro["cancellationSource"]){
         this.status = "Negado Pela Operadora";
      }
      this.storage.ready().then(() => {
        this.storage.get("userLoginInfo").then((userLoginInfo) => {
          
          this.userInfo = userLoginInfo;
          console.log(this.data)
          console.log(this.userInfo);
          if (!this.data.error) {
            let wooData = {
              "customer_id": this.userInfo.id,
              'payment_method': this.data.paymentMethod.type,
              'payment_method_title': this.data.paymentMethod.type == 2 ? 'Boleto' : 'Cartão',
              'set_paid': false,
              "status": (this.status == 'processing' ? this.status : 'failed'),
              "billing": {
                'first_name': this.userInfo.first_name,
                'last_name': this.userInfo.last_name,
                "address_1": this.data.shipping.address.street,
                "address_2": this.data.shipping.address.complement,
                'city': this.data.shipping.address.city,
                'state': this.data.shipping.address.state,
                'postcode': this.data.shipping.address.postcode,
                'country': this.data.shipping.address.country,
                "number": this.data.shipping.address.number,
                "neighborhood": this.data.shipping.address.district,
                "email": this.data.sender.email,
                'phone': "(" + this.data.sender.phone.areaCode+ ")" + this.data.sender.phone.number,
                "persontype": "NaN",
                "cpf": this.userInfo.cpf,
                "rg": this.userInfo.rg,
                "cnpj": "",
                "birthdate": this.userInfo.birthdate,
                "sex": this.userInfo.sex,
                "cellphone": this.userInfo.cellphone
              },
              "shipping": {
                'first_name': this.userInfo.first_name,
                'last_name': this.userInfo.last_name,
                "address_1": this.data.shipping.address.street,
                "address_2": this.data.shipping.address.complement,
                'city': this.data.shipping.address.city,
                'state': this.data.shipping.address.state,
                'postcode': this.data.shipping.address.postcode,
                'country': this.data.shipping.address.country,
                "number": this.data.shipping.address.number,
                "neighborhood": this.data.shipping.address.district
              
              },
              'shipping_lines': [{
                'method_id': this.data.shipping.type,
                'method_title': 'Correios',
                'total': this.data.shipping.cost
              }]
              ,
              "cart_hash": this.data.code,
              "meta_data": [
                {
                  "key": "pagsegurourl",
                  "value": this.data.paymentLink
                },
  
              ],
              'line_items': []
  
            };
  
            if (this.data.items.item.length) {
              for (let i = 0; i < this.data.items.item.length; i++) {
                wooData.line_items.push(
                  {
                    'product_id': this.data.items.item[i].id,
                    'quantity': this.data.items.item[i].quantity
                  }
                );
              }
  
            } else {
              wooData.line_items.push(
                {
                  'product_id': this.data.items.item.id,
                  'quantity': this.data.items.item.quantity
                }
              );
            }
  
  
  
            console.log(wooData);
  
            this.http.get("http://paranoidlab.xyz/storeApi.php?opt=2&endpoint=orders&data=" + JSON.stringify(wooData)).subscribe(rep => {
              console.log(rep.json());
            });
  
          }
        });
      })
  
  


    });
    

  }

  closeModal() {
    if(this.navCtrl.canSwipeBack){
      this.navCtrl.pop();
      this.navCtrl.popToRoot();
    }
    
  }
  getBoleto() {
    this.http.get('http://paranoidlab.xyz/amazoniarica/api.php?opt=getBoleto&code=' + this.data.code).subscribe(data => {
      this.boleto = data;
      console.log(data);
    });
  }
}
