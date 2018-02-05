import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../menu/menu';
import { MyApp } from '../../app/app.component';
import { PhotoViewer } from '@ionic-native/photo-viewer';
@Component({
  selector: 'page-checkout-modal',
  templateUrl: 'checkout-modal.html',
})
export class CheckoutModalPage {
  data: any;
  boleto: any;
  userInfo: any;
  status : any;
  billing;
  shipping;
  user;
  valueData;
  cartData;
  constructor(public photoViewer : PhotoViewer,public storage: Storage, public http: Http, public navCtrl: NavController, public navParams: NavParams) {
    this.data = this.navParams.get('data');
    this.cartData = this.navParams.get('cartData');
    this.billing = this.navParams.get('billing');
    this.shipping = this.navParams.get('shipping');
    this.user = this.navParams.get('user');
    this.valueData = this.navParams.get('valueData');
    this.status = "processing";
    this.http.get("http://amazoniarica.store/api.php?opt=getTransaction&code="+this.data.code).subscribe( resp =>{
      let pagseguro = resp.json();

      this.data = pagseguro;
      console.log(this.data);
      if(pagseguro["cancellationSource"]){
         this.status = "Negado Pela Operadora";
      }
      this.storage.ready().then(() => {
        this.storage.get("userLogin").then((userLoginInfo) => {
          
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
                "first_name": this.user.firstName,
                "last_name": this.user.lastName,
                "address_1": this.billing.rua,
                "address_2": this.billing.complemento,
                "city": this.billing.cidade,
                "state": this.billing.estado,
                "postcode": this.billing.cep,
                "country": this.billing.pais,
                "email": this.user.email,
                "phone": "(" + this.billing.ddd + ")" + this.billing.telefone
              },
              "shipping": {
                "first_name": this.user.firstName,
                "last_name": this.user.lastName,
                "address_1": this.shipping.rua,
                "address_2": this.shipping.complemento,
                "city": this.shipping.cidade,
                "state": this.shipping.estado,
                "postcode": this.shipping.cep,
                "country": this.shipping.pais,
        
              },
              "meta_data": [
                {
                  "key": "_shipping_number",
                  "value": this.shipping.numero
                },
                {
                  "key": "_shipping_neighborhood",
                  "value": this.shipping.bairro
                },
                {
                  "key": "_billing_number",
                  "value": this.billing.numero,
                },
                {
                  "key": "_billing_neighborhood",
                  "value": this.billing.bairro
                },
                {
                  "key": "_billing_cpf",
                  "value": this.user.cpf
                },
                {
                  "key": "_billing_birthdate",
                  "value": this.user.birthDate
                },
                {
                  "key": "_billing_sex",
                  "value": this.user.sex
                },
                {
                  "key": "role",
                  "value": "customer"
                }, 
                {
                  "key": "pagsegurourl",
                  "value": this.data.paymentLink
                },
                {
                  "key": "pagsegurocode",
                  "value": this.data.code

                },
                {
                  "key": "_billing_cnpj",
                  "value": this.user.cnpj
                },
                {
                  "key": "_billing_company",
                  "value": this.user.empresa
                }],
              'shipping_lines': [{
                'method_id': this.data.shipping.type,
                'method_title': 'Correios '+this.valueData.tipoEntrega,
                'total': this.data.shipping.cost
              }]
              ,
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
            this.http.get("http://amazoniarica.store/storeApi.php?opt=2&endpoint=orders&data=" + JSON.stringify(wooData)).subscribe(rep => {
              console.log(rep.json());
              this.http.post("http://amazoniarica.store/sendPush.php",this.cartData).subscribe(push=>{
                console.log(push.text());
                this.storage.remove('cart');
              });
      
            });

          }
        });
      })
  
  


    });
    

  }

  closeModal() {
      this.navCtrl.pop();
      
    
    
  }
  getBoleto() {
    this.http.get('http://amazoniarica.store/api.php?opt=getBoleto&code=' + this.data.code).subscribe(data => {
      this.boleto = data.text();
      this.photoViewer.show(this.boleto, 'Seu Boleto', {share: true});
    });
  }
}
