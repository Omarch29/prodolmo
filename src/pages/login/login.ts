import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ToastController } from 'ionic-angular';


import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  usuario_nombre: string = "";
  password: string = "";
  private itemsCollection: AngularFirestoreCollection<usuario>;
  items: Observable<usuario[]>;
  login_error:boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private afs: AngularFirestore, public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login() {
    console.log("Login Function");
    this.itemsCollection = this.afs.collection<usuario>('usuarios', ref => ref.where('nombre', '==', this.usuario_nombre.toLowerCase() ));
    this.items = this.itemsCollection.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as usuario;
        const id = a.payload.doc.id;
        return { id, ...data };
      });
    });
    this.items.subscribe(user => {
      if (user.length > 0) {
        if (user[0].password == this.password) {
          this.navCtrl.push(TabsPage, {'user': user[0] });
          return
        }
      }
      this.toastCtrl.create({
        message: 'Pone bien la contraseña logi',
        position: 'middle',
        duration: 5000,
      }).present();
    })

    
  }


}
