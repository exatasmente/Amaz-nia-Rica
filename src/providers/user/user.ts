import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

@Injectable()
export class UserProvider {
  firedata = firebase.database().ref('/users');
  constructor(public afireauth: AngularFireAuth) {
   
  }
  adduser(newuser) {
    var promise = new Promise((resolve, reject) => {
      this.afireauth.auth.createUserWithEmailAndPassword(newuser.email, newuser.password).then(() => {
        this.afireauth.auth.currentUser.updateProfile({
          displayName: newuser.displayName,
          photoURL: ''
        }).then(() => {
          this.firedata.child(this.afireauth.auth.currentUser.uid).set({
            uid: this.afireauth.auth.currentUser.uid,
            displayName: newuser.displayName,
            photoURL: ''
          }).then(() => {
            resolve({ success: true });
            }).catch((err) => {
              reject(err);
          })
          }).catch((err) => {
            reject(err);
        })
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  /*
  For resetting the password of the user.
  Called from - passwordreset.ts
  Inputs - email of the user.
  Output - Promise.
  
   */

  passwordreset(email) {
    var promise = new Promise((resolve, reject) => {
      firebase.auth().sendPasswordResetEmail(email).then(() => {
        resolve({ success: true });
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  /*
  
  For updating the users collection and the firebase users list with
  the imageurl of the profile picture stored in firebase storage.
  Called from - profilepic.ts
  Inputs - Url of the image stored in firebase.
  OUtputs - Promise.
  
  */

  getuserdetails() {
    var promise = new Promise((resolve, reject) => {
    this.firedata.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      resolve(snapshot.val());
    }).catch((err) => {
      reject(err);
      })
    })
    return promise;
  }
  getallusers() {
    var promise = new Promise((resolve, reject) => {
      this.firedata.orderByChild('uid').once('value', (snapshot) => {
        let userdata = snapshot.val();
        let temparr = [];
        for (var key in userdata) {
          temparr.push(userdata[key]);
        }
        resolve(temparr);
      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }


}
