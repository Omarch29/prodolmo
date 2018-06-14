import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Tab } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { OrderModule } from 'ngx-order-pipe';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyCr8JvIvTA8YWNA_NiakS262g8Tz4a8WsY",
  authDomain: "prode-374af.firebaseapp.com",
  databaseURL: "https://prode-374af.firebaseio.com",
  projectId: "prode-374af",
  storageBucket: "prode-374af.appspot.com",
  messagingSenderId: "609687961489"
};

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { CargarPage } from '../pages/cargar/cargar';
import { ScorePage } from '../pages/score/score';
import { ResultadosPage } from '../pages/resultados/resultados';
import { TabsPage } from '../pages/tabs/tabs';
import { OtroPage } from '../pages/otro/otro';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    CargarPage,
    ScorePage,
    ResultadosPage,
    TabsPage,
    OtroPage
  ],
  imports: [
    BrowserModule,
    OrderModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CargarPage,
    ScorePage,
    ResultadosPage,
    TabsPage,
    OtroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
