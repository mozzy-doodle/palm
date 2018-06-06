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
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  itemForm: FormGroup;
  restaurantId: string;
  menuSectionCollectionRef: AngularFirestoreCollection<any>;
  menuItemCollectionRef: AngularFirestoreCollection<any>;
  menuItems$: Observable<any[]>;
  menuSections$: Observable<any[]>;
  @ViewChild('grid') grid: MatGridList;

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
     private afs: AngularFirestore,
     private menuService: MenuService,
     private observableMedia: ObservableMedia) {
      this.menuItemCollectionRef = this.afs.collection<any>('menuItems');
      this.menuItems$ = this.menuItemCollectionRef.valueChanges();
      this.menuSections$ = this.menuService.getMenuCategories('0000');
  }

  ngOnInit() {
    this.restaurantId = '0000';

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      restaurantId: this.restaurantId
    });
  }

  addAMenuSectionDialog(): void {
    const addACategoryDialogRef = this.dialog.open(AddACategoryDialogComponent, {
      width: '50%',
      position: { top: '0' },
      data: { name: '', restaurantId: '0000' }
    });

    addACategoryDialogRef.afterClosed().subscribe((category: MenuCategory) => {
      this.addNewMenuCategory(category);
    });

  }

  createNewMenuItem(menuItem: MenuItem): void {
    console.log(menuItem);
    this.menuService.addMenuItem(menuItem);
    this.itemForm.reset();
  }



  addNewMenuCategory(menuCategory: MenuCategory) {
    if (menuCategory) {
      this.menuService.addMenuCategory({...menuCategory, ...{restaurantId: this.restaurantId});
    }
  }
}


