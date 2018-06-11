import { Component, OnInit } from '@angular/core';

import {Directive, Input, ViewChild} from '@angular/core';

import { AddACategoryDialogComponent } from '../add-a-category-dialog/add-a-category-dialog.component';

import { MenuService, MenuCategory, MenuItem } from '../menu.service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatGridList, MatDialog } from '@angular/material';
import { ObservableMedia } from '@angular/flex-layout';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-menu-editor',
  templateUrl: './menu-editor.component.html',
  styleUrls: ['./menu-editor.component.css']
})
export class MenuEditorComponent implements OnInit {

  title = 'app';
  itemForm: FormGroup;
  restaurantId: string;
  allMenuItems: MenuItem[];
  restaurantDocRef: AngularFirestoreDocument<any>;
  restaurant$: Observable<any>;
  restaurant: any;
  menuSectionCollectionRef: AngularFirestoreCollection<any>;
  menuItemCollectionRef: AngularFirestoreCollection<any>;
  menuItems: any[];
  menuItems$: Observable<any[]>;
  menuSections$: Observable<any[]>;
  @ViewChild('grid') grid: MatGridList;

  constructor(
      public dialog: MatDialog,
      private fb: FormBuilder,
      private afs: AngularFirestore,
      private menuService: MenuService) {

      this.menuSections$ = this.menuService.getMenuCategories();
  }

  ngOnInit() {
    this.refreshRestaurantData();

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      restaurantId: this.restaurantId
    });
  }

  refreshRestaurantData() {
    this.menuService.restaurant.subscribe((data) => {
      this.restaurant = data;
      console.log(data);
    });

    this.getMenuItems();
  }

  getMenuItems(section?: string) {
    this.menuService.getMenuItems().subscribe((data) => {
      this.menuItems = data;
    });
  }

  handleSectionChange(event) {
      event.source.deselectAll();
      event.option._setSelected(true);
}

  addAMenuSectionDialog(): void {
    const addACategoryDialogRef = this.dialog.open(AddACategoryDialogComponent, {
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
    if (menuCategory.name && this.restaurant) {
      this.restaurant.menuSections.push(menuCategory.name);
      this.menuService.addMenuCategory(this.restaurant.menuSections);
    }
  }

}
