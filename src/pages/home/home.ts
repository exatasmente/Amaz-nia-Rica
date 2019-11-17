import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  loaded:   boolean = false;
  tabIndex: number  = 0;
  categorias = 'CategoriasPage';
  destaques ='DestaquesPage';
  produtores = 'ProdutoresPage';
  constructor(private nativePageTransitions: NativePageTransitions) {
  
  }
  private getAnimationDirection(index):string {
    var currentIndex = this.tabIndex;
  
    this.tabIndex = index;
  
    switch (true){
      case (currentIndex < index):
        return('left');
      case (currentIndex > index):
        return ('right');
    }
  }
  public transition(e):void {
    let options: NativeTransitionOptions = {
     direction:this.getAnimationDirection(e.index),
     duration: 250,
     slowdownfactor: -1,
     slidePixels: 0,
     iosdelay: 20,
     androiddelay: 0,
     fixedPixelsTop: 0,
     fixedPixelsBottom: 48
    };
  
    if (!this.loaded) {
      this.loaded = true;
      return;
    }
  
    this.nativePageTransitions.slide(options);
  }
  
  
}