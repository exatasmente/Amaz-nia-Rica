import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { WooProvider } from '../../providers/woo/woo';
import { NgZone } from '@angular/core';
import * as pagseguro from 'pagseguro';
import { OnInit } from '@angular/core';

import xml2js from 'xml2js';
import { ModalController } from 'ionic-angular';
import { PaymentModalPage } from '../payment-modal/payment-modal';
import { ToastController } from 'ionic-angular';

declare var PagSeguroDirectPayment;

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {

  WooCommerce: any;
  newOrder: any;
  paymentMethods: any[];
  paymentMethod: any;
  shippingMethods: any[];
  shippingMethod: any;
  billing_shipping_same: boolean;
  userInfo: any;
  cardBrandImage: any;
  atual: any = 'aba1';
  cartData: any;
  constructor(public toastCtrl : ToastController, public modalCtrl: ModalController, public zone: NgZone, public WC: WooProvider, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public http: Http) {
    this.cartData = this.navParams.get("cartData");
    this.newOrder = {};
    this.newOrder.billing_address = {};
    this.newOrder.shipping_address = {};
    this.paymentMethod = {};
    this.zone.run( ()=>{
      this.paymentMethod.payment_id = 'nan';
    })
    
    this.billing_shipping_same = false;
    this.WooCommerce = this.WC.init();
    
    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      this.userInfo = userLoginInfo.user;
      let email = userLoginInfo.user.email;
      this.WooCommerce.getAsync("customers/email/" + email).then((data) => {
        this.newOrder = JSON.parse(data.body).customer;
      })

    })

  }

  ngOnInit(): any {

    PagSeguroDirectPayment.getPaymentMethods({
      success: response => {
        let paymentMethods = response.paymentMethods;
        this.paymentMethods = paymentMethods;



      }
    });
  }

  setBillingToShipping() {
    this.billing_shipping_same = !this.billing_shipping_same;

    if (this.billing_shipping_same) {
      this.newOrder.shipping_address = this.newOrder.billing_address;
    }

  }

  placeOrder() {

    let orderItems: any[] = [];
    let data: any = {};

    let paymentData: any = {};

    this.paymentMethods.forEach((element, index) => {
      if (element.method_id == this.paymentMethod) {
        paymentData = element;
      }
    });
    let payment: any;
    if (paymentData.method_id == "pagseguro") {
      payment = new pagseguro({
        email: 'radiogamerbr@gmail.com',
        token: '58741EDAC9314736BF4E9D4B8A150481'
      });

      payment.currency('BRL');
      payment.reference('12345');


      this.storage.get("cart").then((cart) => {

        cart.forEach((element, index) => {
          payment.addItem({
            id: 'qaq',
            description: 'aaa',
            amount: '10.00',
            quantity: 1
          });
          orderItems.push({
            product_id: element.product.id,
            quantity: element.qty
          });
        });
        data.line_items = orderItems;
        let orderData: any = {};
        orderData.order = data;


        payment.buyer({
          name: this.userInfo.first_name + " " + this.userInfo.last_name,
          email: this.userInfo.email
        });
        payment.shipping({
          type: 1,
          street: 'Rua Alameda dos Anjos',
          number: '367',
          complement: 'Apto 307',
          district: 'Parque da Lagoa',
          postalCode: '01452002',
          city: 'São Paulo',
          state: 'RS',
          country: 'BRA'
        });
        payment.send((err, res) => {
          if (err) {
            console.log(err);
          }
          console.log(res);
        });


        /*
            this.http.get("http://amazoniaricaapi.000webhostapp.com/urlApi.php?order="+JSON.stringify(orderData)).subscribe((data)=>{
              console.log(data);
          });
          */
      });

    }
    /*
      data = {
        payment_details: {
          method_id: paymentData.method_id,
          method_title: paymentData.method_title,
          paid: false
        },
  
        billing_address: this.newOrder.billing_address,
        shipping_address: this.newOrder.shipping_address,
        customer_id: this.userInfo.id || '',
        line_items: orderItems
      };
      
    */
  }
  setPaymentMethod(value) {
    
    if (value == 'card') {
      let modal = this.modalCtrl.create(PaymentModalPage,{total:this.cartData.total});
      modal.onDidDismiss(() => {
        this.storage.get("CardData").then((cardData) => {
          this.zone.run( ()=>{
            this.paymentMethod.payment_id = 'card';        
            this.paymentMethod = cardData;
            console.log(this.paymentMethod);
            this.storage.remove("CardData");
          });
            PagSeguroDirectPayment.getBrand({
              cardBin: this.paymentMethod.cardNumber,
              success: response => {
                this.zone.run(() => {
                  this.cardBrandImage = "https://stc.pagseguro.uol.com.br" + this.paymentMethods["CREDIT_CARD"].options[response.brand.name.toUpperCase()].images["SMALL"].path;
                });
      
              }
  
            });
          })
          
        });
      modal.present()
    } else if (value == 'boleto') {
        this.zone.run( ()=>{
          this.paymentMethod.payment_id = 'boleto';
        });
        
    }
  }

  checkout(){
    let param = {
      cardNumber: this.paymentMethod.cardNumber,
      cvv: this.paymentMethod.cardCVV,
      expirationMonth: this.paymentMethod.cardExpMonth,
      expirationYear: this.paymentMethod.cardExpYear,
      success: (response) => {
        this.paymentMethod.cardToken = response.card.token;
      },
      error: (response) => {
        //tratamento do erro
      },
    }
     PagSeguroDirectPayment.createCardToken(param);

  }

  calculateShipment(){
    
    if(!this.newOrder.shipping_address.postcode || !this.shippingMethod){
      return ;
    }
    let height :any = 0;
    let width : any = 0;
    let length: any = 0 ;
    let qts :any = 0 ;
    
    this.cartData.cartItens.forEach( item =>{
        height += item.height ? parseFloat(item.height)*item.qty : 0;
        width += item.width ? parseFloat(item.width)*item.qty : 0;
        height += item.length ? parseFloat(item.length)*item.qty : 0;

        qts += item.qty;
    });
    this.http.get("http://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdServico="+
        (this.shippingMethod == "pac" ? '41106' : '40010')
        +"&nCdEmpresa&sDsSenha&sCepDestino="+
        this.newOrder.shipping_address.postcode+
        "&sCepOrigem=66065310&nVlAltura="
        +(height >= 2 ? height : 2)+
        "&nVlLargura="+(width >= 11 ? width : 11)+
        "&nVlDiametro=0"+
        "&nVlComprimento="+(length > 16 ? length : 16)+
        "&nVlPeso="+"0"+
        "&nCdFormato=1&sCdMaoPropria=N&nVlValorDeclarado="+
        parseInt(this.cartData.total)
        +"&sCdAvisoRecebimento=S&StrRetorno=xml").
        subscribe((data) => {
          
          xml2js.parseString(data.text(),(err,jsondata)=>{
            try{
              let response = (JSON.parse(JSON.stringify(jsondata))['Servicos'].cServico[0]);
              console.log(response);
              if(response['Erro'][0] == "0"){
                this.cartData.shippingData.shipmentDate = response['PrazoEntrega'][0];
                if(!this.cartData.shippingData.shipmentValue){
                  this.cartData.shippingData.shipmentValue = parseFloat(response['Valor'][0]);
                  this.cartData.total += this.cartData.shippingData.shipmentValue;
                }else{
                  this.cartData.total -= this.cartData.shippingData.shipmentValue;
                  this.cartData.shippingData.shipmentValue = parseFloat(response['Valor'][0]);
                  this.cartData.total += this.cartData.shippingData.shipmentValue;
                }
              }
            }catch(e){
                this.toastCtrl.create({
                  message: e,
                  closeButtonText: "Ok",
                  showCloseButton: true
                }).present();
            }
          });
          
        },(error) => {
                this.toastCtrl.create({
                  message: error,
                  closeButtonText: "Ok",
                  showCloseButton: true
                }).present();
        
      });
      
  }

}

