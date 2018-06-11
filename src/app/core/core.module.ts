import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBfPNorx3PuGs095u-g-um_4wT47n2e8jE',
    authDomain: 'palm-d5c36.firebaseapp.com',
    databaseURL: 'https://palm-d5c36.firebaseio.com',
    projectId: 'palm-d5c36',
    storageBucket: 'palm-d5c36.appspot.com',
    messagingSenderId: '991626841834'
  }
};


@NgModule({
  providers: [AuthService, AuthGuard],
  imports: [
  CommonModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence()
  ],
  exports: [
  AngularFirestoreModule, AngularFireAuthModule, AngularFireModule
  ],
  declarations: []
})
export class CoreModule { }
