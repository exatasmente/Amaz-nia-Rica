import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerContactPage } from './seller-contact';

@NgModule({
  declarations: [
    SellerContactPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerContactPage),
  ],
})
export class SellerContactPageModule {}
