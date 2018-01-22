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
  constructor(public storage: Storage, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get("data");
    //this.data = JSON.parse('{"date":"2018-01-22T16:38:23.000-02:00","code":"EBBF6AFC-760B-453A-89D0-6C0960853F00","reference":"1","type":"1","status":"1","lastEventDate":"2018-01-22T16:38:25.000-02:00","paymentMethod":{"type":"2","code":"202"},"paymentLink":"https:\/\/pagseguro.uol.com.br\/checkout\/payment\/booklet\/print.jhtml?c=1968410ddb72ce9a91012fcac0d4023a56bd875e47664eb682d6c554eb82ca7ac970e54a1db564dc","grossAmount":"52.89","discountAmount":"0.00","feeAmount":"2.51","netAmount":"50.38","extraAmount":"0.00","installmentCount":"1","itemCount":"1","items":{"item":{"id":"32","description":"Lavender Red Towel","quantity":"1","amount":"31.89"}},"sender":{"name":"Luiz Neto","email":"lu_u_z@hotmail.com","phone":{"areaCode":"88","number":"994657031"}},"shipping":{"address":{"street":"Tv. Castelo Branco","number":"1882","complement":"entre pariquis e caripunas","district":"guam\u00e1","city":"Bel\u00e9m","state":"PA","country":"BRA","postalCode":"66065310"},"type":"3","cost":"21.00"}}');
    //this.data = JSON.parse('{"date":"2018-01-22T17:04:30.000-02:00","code":"66DBA2D4-E003-408B-B9AA-D1969A39F57D","reference":"1","type":"1","status":"1","lastEventDate":"2018-01-22T17:04:31.000-02:00","paymentMethod":{"type":"2","code":"202"},"paymentLink":"https:\/\/pagseguro.uol.com.br\/checkout\/payment\/booklet\/print.jhtml?c=54e1da6ad59941de218dd580c2cf93ba69cbc9e05b6d4d4bcd7781d390c5fa0fde9b97a5191ff0bd","grossAmount":"134.51","discountAmount":"0.00","feeAmount":"5.77","netAmount":"128.74","extraAmount":"0.00","installmentCount":"1","itemCount":"2","items":{"item":[{"id":"32","description":"Lavender Red Towel","quantity":"1","amount":"31.89"},{"id":"20","description":"Beverage Refrigerator","quantity":"1","amount":"80.62"}]},"sender":{"name":"Luiz Neto","email":"lu_u_z@hotmail.com","phone":{"areaCode":"88","number":"994657031"}},"shipping":{"address":{"street":"Tv. Castelo Branco","number":"1882","complement":"entre pariqus e caripunas","district":"Guam\u00e1","city":"Bel\u00e9m","state":"PA","country":"BRA","postalCode":"66065310"},"type":"3","cost":"22.00"}}');
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
            "status": "processing",
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
              'method_title': '',
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

          this.http.get("http://localhost:8100/storeApi?opt=2&endpoint=orders&data=" + JSON.stringify(wooData)).subscribe(rep => {
            console.log(rep.json());
          });

        }
      });
    })



  }

  closeModal() {
    this.navCtrl.popToRoot();
  }
  getBoleto() {
    this.http.get('http://localhost:8100/api?opt=getBoleto&code=' + this.data.code).subscribe(data => {
      this.boleto = data;
      console.log(data);
    });
  }
}
