import { Component } from '@angular/core';
import {NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { WooProvider } from '../../providers/woo/woo';
import { NgZone } from '@angular/core';

import { OnInit } from '@angular/core';

import xml2js from 'xml2js';
import { ModalController } from 'ionic-angular';
import { PaymentModalPage } from '../payment-modal/payment-modal';
import { ToastController } from 'ionic-angular';
import { CheckoutModalPage } from '../checkout-modal/checkout-modal';
import { LoadingController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

declare var PagSeguroDirectPayment;

@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage implements OnInit {
  editar : any = false;
  WooCommerce: any;
  newOrder: any  = {};
  paymentMethods: any[];
  paymentMethod: any = {};
  shippingMethods: any[];
  shippingMethod: any = {};
  billing_shipping_same: boolean;
  
  cardBrandImage: any;
  user: FormGroup;
  atual: any = 'aba1';
  billing: FormGroup;
  shipping: FormGroup;
  valido: any = false;
  authForm : FormGroup;

  cartData: any;
  constructor(public formBuilder: FormBuilder,public loadingCtrl : LoadingController, public toastCtrl : ToastController, public modalCtrl: ModalController, public zone: NgZone, public WC: WooProvider, public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public alertCtrl: AlertController, public http: Http) {
    this.cartData = this.navParams.get("cartData");
    this.newOrder = {};
    this.authForm = formBuilder.group({
      username: ['', Validators.compose([Validators.required,Validators.minLength(8)])],
      password: ['', Validators.compose([Validators.required,Validators.minLength(8)])]
    });
    
    this.billing_shipping_same = false;

    this.zone.run( ()=>{
      this.paymentMethod.payment_id = 'nan';
    })
    
    this.WooCommerce = WC.init();
    this.billing_shipping_same = false;


  }

  prosseguir(next) {
    if(next == 'aba2'){
      if (this.user.valid) {
        this.atual = next;
      } else {
        this.toastCtrl.create({
          message: "Verifique todos os campos e preençha corretamente",
          showCloseButton: true,
          closeButtonText: "OK",
          duration: 2000
        }).present();
      }
    }else if (next == 'aba3') {
      console.log(this.valid());
      if (this.valid()) {
        this.atual = next;
      } else {
        this.toastCtrl.create({
          message: "Verifique todos os campos e preençha corretamente",
          showCloseButton: true,
          closeButtonText: "OK",
          duration: 2000
        }).present();
      }


    }


  }
  valid() {
    if (this.billing_shipping_same) {
      
      return (this.billing.valid && this.user.valid) ;
    } else {
      
      return (this.billing.valid && this.shipping.valid) && this.user.valid;
    }
  }
  

  ngOnInit(): any {
    this.storage.get("userLoginInfo").then( userData =>{
      this.billing = this.formBuilder.group({
        rua: [userData.billing.address_1, Validators.compose([Validators.required])],
        numero: [, Validators.compose([Validators.required])],
        complemento: [userData.billing.address_2, Validators.compose([Validators.required])],
        pais: [userData.billing.country, Validators.compose([Validators.required])],
        estado: [userData.billing.state, Validators.compose([Validators.required])],
        cidade: [userData.billing.city, Validators.compose([Validators.required])],
        bairro: ['', Validators.compose([Validators.required])],
        cep: [userData.billing.postcode, Validators.compose([Validators.required])],
        ddd: ['', Validators.compose([Validators.required])],
        telefone: ['', Validators.compose([Validators.required])]
      });
      this.user = this.formBuilder.group({
        firstName: [userData.first_name, Validators.compose([Validators.required])],
        lastName: [userData.last_name, Validators.compose([Validators.required])],
        email: [userData.email, Validators.compose([Validators.required, Validators.email])],
        cpf: ['', Validators.compose([Validators.required])],
        birthDate: ['', Validators.compose([Validators.required])],
        sex: ['', Validators.compose([Validators.required])]
      });
      
      this.shipping = this.formBuilder.group({
        rua: ['', Validators.compose([Validators.required])],
        numero: ['', Validators.compose([Validators.required])],
        complemento: ['', Validators.compose([Validators.required])],
        pais: ['', Validators.compose([Validators.required])],
        estado: ['', Validators.compose([Validators.required])],
        cidade: ['', Validators.compose([Validators.required])],
        bairro: ['', Validators.compose([Validators.required])],
        cep: ['', Validators.compose([Validators.required])],
        ddd: ['', Validators.compose([Validators.required])],
        telefone: ['', Validators.compose([Validators.required])]
      });
      this.editar = true;
    });
    
    PagSeguroDirectPayment.getPaymentMethods({
      success: response => {
        let paymentMethods = response.paymentMethods;
        this.paymentMethods = paymentMethods;



      }
    });
  }


  placeOrder() {
    let user = this.user.value;
    let billing = this.billing.value;
    let shipping = this.shipping.value;
    user.birthDate= user.birthDate.split('-').reverse().join('/');
    console.log(user);
    
    if(this.billing_shipping_same){
      shipping = billing;
    }
    let cardData : any = {};
    let comprador : any = {};
    let produtos : any[] = [];
    let valueData : any = {};
    comprador.cobranca = {};
    let loading = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loading.present();
    comprador.senderHash = PagSeguroDirectPayment.getSenderHash();
    console.log(this.paymentMethod.payment_id);
    if(this.paymentMethod.payment_id == 'card'){
      let param = {
        cardNumber: this.paymentMethod.cardNumber,
        cvv: this.paymentMethod.cardCVV,
        expirationMonth: this.paymentMethod.cardExpMonth,
        expirationYear: this.paymentMethod.cardExpYear,
        success: (response) => {  
          this.newOrder.token = response.card.token;
          cardData.cardtoken = this.newOrder.token;
          console.log(cardData.cardtoken);
          cardData.parcelas = {
            qty : this.paymentMethod.parcela.quantity,
            qtysjuros : this.paymentMethod.parcela.quantity > 1 ? this.paymentMethod.parcela.quantity : 6,
            valor : this.paymentMethod.parcela.installmentAmount
          };
          
          cardData.holdername =  user.firstName + " " + user.lastName;;
          cardData.holdercpf = user.cpf;
          cardData.holderbirthdate = user.birthDate;
          cardData.phone = {
            area : user.ddd,
            number : user.telefone
          };
          cardData.address = {
            rua : billing.rua,
            numero : billing.numero,
            complemento : billing.complemento,
            bairro : billing.bairro,
            cidade : billing.cidade,
            pais : billing.pais,
            cep : billing.cep,
            estado : billing.estado
        };
      
      comprador.cobranca.phone = { 
        area : billing.ddd, 
        number : billing.telefone
      };
      comprador.birthDate  =user.birthDate;
      comprador.cpf = user.cpf;
      comprador.nome = user.firstName + " " + user.lastName;
      comprador.email = user.email;
      this.cartData.cartItens.forEach(p => {
        produtos.push({
          id : p.product.id, 
          title : p.product.title , 
          amount: p.amount.toFixed(2),
          qty : p.qty 
        });
      });
          
      comprador.shipping = {
        rua : shipping.rua,
        numero : shipping.numero,
        complemento : shipping.complemento,
        bairro : shipping.bairro,
        cidade : shipping.cidade,
        pais : shipping.pais,
        cep : shipping.cep,
        estado : shipping.estado
      };
      valueData = { 
        tipoEntrega : this.newOrder.tipoEntrega,
        valorEntrega : this.newOrder.valorEntrega
      };      
      console.log(JSON.stringify(cardData));
      this.http.get("http://paranoidlab.xyz/amazoniarica/api.php?opt=transactions/cartao&produtos="+
      JSON.stringify(produtos)+
      "&comprador="+JSON.stringify(comprador)+
      "&valueData="+JSON.stringify(valueData)+
      "&cardData="+JSON.stringify(cardData)
      ).subscribe( data =>{
        loading.dismiss();
        this.storage.remove("cart");
        console.log(data.json());
        this.navCtrl.push(CheckoutModalPage,{data: data.json()});
      
      })
        },
        error: (response) => {
          console.log(response);
          loading.dismiss();
        },
      }
      PagSeguroDirectPayment.createCardToken(param);
      
    }else if(this.paymentMethod.payment_id == 'boleto'){
      
      console.log(comprador.senderHash);
      comprador.cobranca.phone = { 
        area : user.ddd, 
        number : user.telefone
      };
      comprador.birthDate  = user.birthDate;
      comprador.cpf = user.cpf;
      comprador.nome = user.firstName + " " + user.lastName;
      comprador.email = user.email;
      this.cartData.cartItens.forEach(p => {
        produtos.push({
          id : p.product.id, 
          title : p.product.title , 
          amount: p.amount.toFixed(2) , 
          qty : p.qty 
        });
      });

      comprador.shipping = {
        rua : shipping.rua,
        numero : shipping.numero,
        complemento : shipping.complemento,
        bairro : shipping.bairro,
        cidade : shipping.cidade,
        pais : shipping.pais,
        cep : shipping.cep,
        estado : shipping.estado
        
      };
      valueData = { 
        tipoEntrega : this.newOrder.tipoEntrega,
        valorEntrega : this.newOrder.valorEntrega
      };
      console.log(comprador);
      console.log(valueData);
      this.http.get("http://paranoidlab.xyz/amazoniarica/api.php?opt=transactions/boleto&produtos="+
      JSON.stringify(produtos)+
      "&comprador="+JSON.stringify(comprador)+
      "&valueData="+JSON.stringify(valueData)
      ).subscribe( data =>{
        loading.dismiss();
        this.storage.remove("cart");
        this.modalCtrl.create(CheckoutModalPage,{data: data.json()}).present();
      })
    }

  }
  setPaymentMethod(value) {
    
    if (value == 'card') {
      let modal = this.modalCtrl.create(PaymentModalPage,{total:this.cartData.total});
      modal.onDidDismiss(() => {
        this.storage.get("CardData").then((cardData) => {
          this.zone.run( ()=>{
            if(cardData.cardNumber != ''){
              this.paymentMethod = cardData;
              this.paymentMethod.payment_id = 'card';        
            }else{
              this.paymentMethod.payment_id = 'nan';        
            }
            console.log(this.paymentMethod);
            this.storage.remove("CardData");
          });
            PagSeguroDirectPayment.getBrand({
              cardBin: this.paymentMethod.cardNumber,
              success: response => {
                this.zone.run(() => {
                  this.cardBrandImage = "http://stc.pagseguro.uol.com.br" + this.paymentMethods["CREDIT_CARD"].options[response.brand.name.toUpperCase()].images["SMALL"].path;
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
    
    if(!this.shipping.value.cep || !this.shippingMethod){
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
        this.shipping.value.cep+
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
  
}

