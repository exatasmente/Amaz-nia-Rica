import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class AuthProvider {

  constructor(public fireBaseAuth : AngularFireAuth) {
    
  }
  login(userData){
    var promise = new Promise((resolve,reject)=>{
      this.fireBaseAuth.auth.signInWithEmailAndPassword(userData.email,userData.senha).then(()=>{
        resolve(true);
      }).catch((err) => {
        reject(err);
       })
    })

    return promise;
  }
}
