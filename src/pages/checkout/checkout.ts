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
import { componentFactoryName } from '@angular/compiler';

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
    this.newOrder.phone = {};
    this.newOrder.cardData = {};
    this.newOrder.cardData.phone = {};
    this.newOrder.cardData.parcelas ={};
    this.newOrder.cardData.user = {};
    this.newOrder.cardData.address = {};
    this.newOrder.shipping = {};
    this.newOrder.shipping.phone = {};
    this.newOrder.user = {};
    this.paymentMethod = {};
    this.zone.run( ()=>{
      this.paymentMethod.payment_id = 'nan';
    })
    this.WooCommerce = WC.init();
    this.billing_shipping_same = false;
    this.storage.get("userLoginInfo").then((userLoginInfo) => {
      this.userInfo = userLoginInfo.user;
    
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
    if (this.billing_shipping_same) {
      this.newOrder.shipping  = this.newOrder.cardData.address;
      this.newOrder.shipping.phone = this.newOrder.cardData.phone;
    }

  }

  placeOrder() {
    let cardData : any = {};
    let comprador : any = {};
    let produtos : any[] = [];
    let valueData : any = {};
    comprador.cobranca = {};
    comprador.senderHash = PagSeguroDirectPayment.getSenderHash();
    console.log(this.paymentMethod.payment_id);
    if(this.paymentMethod.payment_id == 'card'){
      let param = {
        cardNumber: this.paymentMethod.cardNumber,
        cvv: this.paymentMethod.cardCVV,
        expirationMonth: this.paymentMethod.cardExpMonth,
        expirationYear: this.paymentMethod.cardExpYear,
        success: (response) => {  
          this.newOrder.cardData.token = response.card.token;
          cardData.cardtoken = this.newOrder.cardData.token;
          console.log(cardData.cardtoken);
          cardData.parcelas = {
            qty : this.paymentMethod.parcela.quantity,
            qtysjuros : this.paymentMethod.parcela.quantity < 6 ? this.paymentMethod.parcela.quantity : 6,
            valor : this.paymentMethod.parcela.installmentAmount
          };
          
          cardData.holdername =  this.newOrder.user.firstName + " " + this.newOrder.user.lastName;;
          cardData.holdercpf = this.newOrder.user.cpf;;
          cardData.holderbirthdate = this.newOrder.user.birthDate;
          cardData.phone = {
            area : this.newOrder.cardData.phone.area,
            number : this.newOrder.cardData.phone.number
          };
          cardData.address = {
            rua : this.newOrder.cardData.address.rua,
            numero : this.newOrder.cardData.address.numero,
            complemento : this.newOrder.cardData.address.complemento,
            bairro : this.newOrder.cardData.address.bairro,
            cidade : this.newOrder.cardData.address.cidade,
            pais : this.newOrder.cardData.address.pais,
            cep : this.newOrder.cardData.address.cep,
            estado : this.newOrder.cardData.address.estado
        };
      
      comprador.cobranca.phone = { 
        area : this.newOrder.cardData.phone.area, 
        number : this.newOrder.cardData.phone.number
      };
      comprador.birthDate  = this.newOrder.user.birthDate;
      comprador.cpf = this.newOrder.user.cpf;
      comprador.nome = this.newOrder.user.firstName + " " + this.newOrder.user.lastName;
      comprador.email = this.newOrder.user.email;
      this.cartData.cartItens.forEach(p => {
        produtos.push({
          id : p.product.id, 
          title : p.product.title , 
          amount: p.amount , 
          qty : p.qty 
        });
      });
          
      comprador.shipping = {
        rua : this.newOrder.shipping.rua,
        numero : this.newOrder.shipping.numero,
        complemento : this.newOrder.shipping.complemento,
        bairro : this.newOrder.shipping.bairro,
        cidade : this.newOrder.shipping.cidade,
        pais : this.newOrder.shipping.pais,
        cep : this.newOrder.shipping.cep,
        estado : this.newOrder.shipping.estado
      };
      valueData = { 
        tipoEntrega : this.newOrder.tipoEntrega,
        valorEntrega : this.newOrder.valorEntrega
      };      
      console.log(JSON.stringify(cardData));
      this.http.post("http://localhost/api?opt=transactions/cartao&produtos="+
      JSON.stringify(produtos)+
      "&comprador="+JSON.stringify(comprador)+
      "&valueData="+JSON.stringify(valueData)+
      "&cardData="+JSON.stringify(cardData),{}
      ).subscribe( data =>{
        //let rep = data.json();
        console.log(data);
      })
        },
        error: (response) => {
        },
      }
      PagSeguroDirectPayment.createCardToken(param);
      
    }else if(this.paymentMethod.payment_id == 'boleto'){
      
      console.log(comprador.senderHash);
      comprador.cobranca.phone = { 
        area : this.newOrder.cardData.phone.area, 
        number : this.newOrder.cardData.phone.number
      };
      comprador.birthDate  = this.newOrder.user.birthDate;
      comprador.cpf = this.newOrder.user.cpf;
      comprador.nome = this.newOrder.user.firstName + " " + this.newOrder.user.lastName;
      comprador.email = this.newOrder.user.email;
      this.cartData.cartItens.forEach(p => {
        produtos.push({
          id : p.product.id, 
          title : p.product.title , 
          amount: p.amount , 
          qty : p.qty 
        });
      });

      comprador.shipping = {
        rua : this.newOrder.shipping.rua,
        numero : this.newOrder.shipping.numero,
        complemento : this.newOrder.shipping.complemento,
        bairro : this.newOrder.shipping.bairro,
        cidade : this.newOrder.shipping.cidade,
        pais : this.newOrder.shipping.pais,
        cep : this.newOrder.shipping.cep,
        estado : this.newOrder.shipping.estado
        
      };
      valueData = { 
        tipoEntrega : this.newOrder.tipoEntrega,
        valorEntrega : this.newOrder.valorEntrega
      };
      this.http.post("http://localhost/api?opt=transactions/boleto&produtos="+
      JSON.stringify(produtos)+
      "&comprador="+JSON.stringify(comprador)+
      "&valueData="+JSON.stringify(valueData),{}
      ).subscribe( data =>{
        let rep = data.json();
        console.log(rep);
      })
    }

  }
  setPaymentMethod(value) {
    
    if (value == 'card') {
      let modal = this.modalCtrl.create(PaymentModalPage,{total:this.cartData.total});
      modal.onDidDismiss(() => {
        this.storage.get("CardData").then((cardData) => {
          this.zone.run( ()=>{
            this.paymentMethod = cardData;
            this.paymentMethod.payment_id = 'card';        
            
            console.log(this.paymentMethod);
            this.storage.remove("CardData");
          });
            PagSeguroDirectPayment.getBrand({
              cardBin: this.paymentMethod.cardNumber,
              success: response => {
                this.zone.run(() => {
                  //this.cardBrandImage = newOrder.shippings://stc.pagseguro.uol.com.br" + this.paymentMethods["CREDIT_CARD"].options[response.brand.name.toUpperCase()].images["SMALL"].path;
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


  calculateShipment(){
    
    if(!this.newOrder.shipping.cep || !this.shippingMethod){
      return ;
    }
    this.newOrder.tipoEntrega = this.shippingMethod;
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
        this.newOrder.shipping.cep+
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
                this.newOrder.prazoEntrega = response['PrazoEntrega'][0];
                if(!this.cartData.shippingData.shipmentValue){
                  this.cartData.shippingData.shipmentValue = parseFloat(response['Valor'][0]);
                  this.cartData.total += this.cartData.shippingData.shipmentValue;
                }else{
                  this.cartData.total -= this.cartData.shippingData.shipmentValue;
                  this.cartData.shippingData.shipmentValue = parseFloat(response['Valor'][0]);
                  this.cartData.total += this.cartData.shippingData.shipmentValue;
                }
                this.newOrder.valorEntrega = this.cartData.shippingData.shipmentValue;
              }else{
                this.toastCtrl.create({
                  message: "Verifique o CEP e tente novamente",
                  closeButtonText: "Ok",
                  showCloseButton: true,
                  duration: 3000

                }).present();  
              }
            }catch(e){
                this.toastCtrl.create({
                  message: "Algo Inseperado Aconteçeu, estamos tentando Resolver",
                  closeButtonText: "Ok",
                  showCloseButton: true,
                  duration: 3000

                }).present();
            }
          });
          
        },(error) => {
                this.toastCtrl.create({
                  message: "Algo de Errado aconteceu, já estamos tentando resolver",
                  closeButtonText: "Ok",
                  showCloseButton: true,
                  duration: 3000
                }).present();
        
      });
      
  }
  getDate(val : any){
    this.newOrder.user.birthDate = val._text;
  }

}

