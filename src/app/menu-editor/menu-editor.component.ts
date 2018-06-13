import { Component, OnInit } from '@angular/core';

import {ViewChild} from '@angular/core';

import { AddACategoryDialogComponent } from '../add-a-category-dialog/add-a-category-dialog.component';
import {MatSnackBar} from '@angular/material';


import { MenuService, MenuCategory, MenuItem } from '../menu.service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatGridList, MatDialog } from '@angular/material';


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
  menuItems: MenuItem[];
  menuItems$: Observable<any[]>;
  menuSections$: Observable<any[]>;
  selectedItem: any;
  displayedItems: MenuItem[];
  @ViewChild('grid') grid: MatGridList;
  sections: any[];
  selectedSection: any;

  constructor(
      public dialog: MatDialog,
      private fb: FormBuilder,
      private afs: AngularFirestore,
      private menuService: MenuService,
      public snackBar: MatSnackBar) {

      this.menuSections$ = this.menuService.getMenuCategories();
  }

  ngOnInit() {
    this.getAllRestaurantData();
    this.getAllMenuItems();

    this.itemForm = this.fb.group({
      name: '',
      description: '',
      restaurantId: this.restaurantId,
      id: ''
    });
  }

  // Refresh restaurant data
  getAllRestaurantData() {
    this.menuService.restaurant.subscribe((data) => {
      if (data) {
        this.restaurant = data;
        this.sections = data.menuSections;
        this.selectedSection = data.menuSections[0]; // Default to first one
      }
    });
  }

  getAllMenuItems() {
    this.menuService.getMenuItems().subscribe((data) => {
      this.menuItems = data.filter((x) => x.menuSection);
      this.displayedItems = this.menuItems.filter((x: MenuItem) => x.menuSection === this.selectedSection);
    });
  }

  onChangeItem(event) {
    event.source.deselectAll();
    event.option._setSelected(true);
    this.selectedItem = event.option.value;

    // Set the form
    this.itemForm.patchValue(event.option.value);
  }

  onSectionChange(event) {
      event.source.deselectAll();
      event.option._setSelected(true);
      this.selectedSection = event.option.value;
      this.displayedItems = this.menuItems.filter((x: MenuItem) => x.menuSection === this.selectedSection);
      this.selectedItem = this.displayedItems[0];
      this.itemForm.patchValue(this.selectedItem);
}


  addAMenuSectionDialog(): void {
    const addACategoryDialogRef = this.dialog.open(AddACategoryDialogComponent, {
      data: { name: '', restaurantId: '0000' }
    });

    addACategoryDialogRef.afterClosed().subscribe((category: MenuCategory) => {
      this.addNewMenuCategory(category);
    });

  }

  createNewMenuItem() {
    this.itemForm.reset();
    this.selectedItem = null;
  }


  addNewMenuCategory(menuCategory: MenuCategory) {
    if (menuCategory.name && this.restaurant) {
      this.restaurant.menuSections.push(menuCategory.name);
      this.menuService.addMenuCategory(this.restaurant.menuSections);
    }
  }

  saveItem(message: string, action: string) {
    console.log('save');
    console.log(this.itemForm.value);
    this.menuService.updateItem(this.itemForm.value);
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
