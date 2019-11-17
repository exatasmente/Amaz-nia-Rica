import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
@Injectable()
export class ServiceApi {
  
  constructor(public http: Http) {
  }
  
  get(){
    var promise = new Promise((resolve, reject) => {
      this.http.get("url").subscribe((resp) => {
        resolve(true);

        reject(false);
      });
    });


    return promise;

  }
  create(){
    var promise = new Promise((resolve, reject) => {
      this.http.get("url").subscribe((resp) => {
        resolve(true);

        reject(false);
      });
    });


    return promise;

  }
  update(){
    var promise = new Promise((resolve, reject) => {
      this.http.get("url").subscribe((resp) => {
        resolve(true);

        reject(false);
      });
    });


    return promise;

  }
  remove(){
    var promise = new Promise((resolve, reject) => {
      this.http.get("url").subscribe((resp) => {
        resolve(true);

        reject(false);
      });
    });


    return promise;

  }
 
}
