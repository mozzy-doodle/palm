import { AfterContentInit, Component, OnInit, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatGridList} from '@angular/material';

import {MediaChange, ObservableMedia} from '@angular/flex-layout';

import { MenuService, MenuCategory, MenuItem } from './menu.service';
import { AddACategoryDialogComponent } from './add-a-category-dialog/add-a-category-dialog.component';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  ngOnInit() { console.log('on init'); }
}


