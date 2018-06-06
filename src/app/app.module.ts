import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {Component} from '@angular/core';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { MenuService } from './menu.service';

import { FlexLayoutModule } from '@angular/flex-layout';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// tslint:disable-next-line:max-line-length
import {MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';


import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AddACategoryDialogComponent } from './add-a-category-dialog/add-a-category-dialog.component';

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

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  // {path: '', component: HeroTopComponent},
  // {path: AppConfig.routes.heroes, loadChildren: './heroes/heroes.module#HeroesModule'},
  // {path: AppConfig.routes.error404, component: Error404Component},

  // // otherwise redirect to 404
  // {path: '**', redirectTo: '/' + AppConfig.routes.error404}
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AddACategoryDialogComponent
  ],
  imports: [
    FlexLayoutModule,
    MatButtonModule,
     MatMenuModule, 
     MatInputModule,
     MatCardModule,
     MatDialogModule,
     MatFormFieldModule,
     MatCheckboxModule,
     MatGridListModule,
     BrowserModule, 
     FormsModule,
     ReactiveFormsModule,
     AngularFireModule.initializeApp(environment.firebase),
     AngularFirestoreModule.enablePersistence(),
     MatToolbarModule,
     BrowserAnimationsModule,
     RouterModule.forRoot(routes),
      LayoutModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule
  ],
  providers: [MenuService],
  entryComponents: [AddACategoryDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
