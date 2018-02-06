import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProdutoresPopOverPage } from './produtores-pop-over';

@NgModule({
  declarations: [
    ProdutoresPopOverPage,
  ],
  imports: [
    IonicPageModule.forChild(ProdutoresPopOverPage),
  ],
})
export class ProdutoresPopOverPageModule {}
