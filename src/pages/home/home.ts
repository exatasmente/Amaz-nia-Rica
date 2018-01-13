import { Component } from '@angular/core';
import { CategoriasPage } from '../categorias/categorias';
import { DestaquesPage } from '../destaques/destaques';





@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  

  categorias = CategoriasPage;
  destaques = DestaquesPage;
  
  constructor() {
  
  }
  
  
}