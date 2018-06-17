import { Component, OnInit } from '@angular/core';

import {ViewChild} from '@angular/core';

import { AddACategoryDialogComponent } from '../add-a-category-dialog/add-a-category-dialog.component';

import {MatSnackBar} from '@angular/material';


import { MenuService, MenuCategory, MenuItem } from '../menu.service';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatGridList, MatDialog } from '@angular/material';
import { AddMenuItemDialogComponent } from '../add-menu-item-dialog/add-menu-item-dialog.component';


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
  updating: boolean;
  sections: any[];
  selectedSection: any;

  constructor(
      public dialog: MatDialog,
      private fb: FormBuilder,
      private afs: AngularFirestore,
      private menuService: MenuService,
      public snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.getAllRestaurantData();
    this.getAllMenuItems();

    this.itemForm = this.fb.group({
      name: '',
      description: '',
      price: 0
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
      this.selectedItem = this.displayedItems[0];
    });
  }


  onSectionChange(event) {
      event.source.deselectAll();
      event.option._setSelected(true);
      this.updating = true;
      this.selectedSection = event.option.value;
      this.displayedItems = this.menuItems.filter((x: MenuItem) => x.menuSection === this.selectedSection);
      this.selectedItem = this.displayedItems[0];
      this.itemForm.patchValue(this.selectedItem);
}

  onChangeItem(event) {
    this.updating = true;
    this.selectedItem = event.value;
    this.itemForm.patchValue(this.selectedItem); // Update form on menu item section
  }

  onChangeItemMobile(event) {
    this.updating = true;
    this.selectedItem = event.value;
    this.itemForm.patchValue(this.selectedItem); // Update form on menu item section
    this.editMenuItemDialog(this.selectedItem);
  }

  editMenuItemDialog(item: MenuItem): void {
    const editItemDialog = this.dialog.open(AddMenuItemDialogComponent, {
      data: item
    });

    editItemDialog.afterClosed().subscribe((menuItem: MenuItem) => {
      // this.addNewMenuCategory(category);
      if (menuItem) {
        this.saveItem(menuItem);
      }
    });
  }


  onSectionChangeV2(event) {
    this.updating = true;
    this.selectedSection = event.value;
    this.displayedItems = this.menuItems.filter((x: MenuItem) => x.menuSection === this.selectedSection);
    this.selectedItem = this.displayedItems[0];
    this.itemForm.patchValue(this.selectedItem);
  }

  addAMenuSectionDialog(): void {
    const addACategoryDialogRef = this.dialog.open(AddACategoryDialogComponent, {
      data: { name: '' }
    });

    addACategoryDialogRef.afterClosed().subscribe((category: MenuCategory) => {
      this.addNewMenuCategory(category);
    });
  }

  editMenuSectionDialog(section: string): void {
    const addACategoryDialogRef = this.dialog.open(AddACategoryDialogComponent, {
      data: { name: section }
    });

    addACategoryDialogRef.afterClosed().subscribe((category: MenuCategory) => {
      // this.addNewMenuCategory(category);
    });
  }


  // Optional param is for dialog to pass in value manually
  onClickCreateNewItem(item?: MenuItem) {
    this.itemForm.reset();
    this.updating = false;
    this.selectedItem = null;
  }


  addNewMenuCategory(menuCategory: MenuCategory) {
    if (menuCategory.name && this.restaurant) {
      this.restaurant.menuSections.push(menuCategory.name);
      this.menuService.addMenuCategory(this.restaurant.menuSections);
    }
  }

  saveItem(item?: MenuItem) {
    if (item) {
      this.menuService.updateItem(item, this.selectedItem.id);
    } else {
      this.menuService.updateItem(this.itemForm.value, this.selectedItem.id);
    }
    this.snackBar.open('Saved item changes!', '', {
      duration: 2000,
    });
  }

  // NOTE: pass in item from dialog
  createItem(item?: MenuItem) {
    if (item) {
      this.menuService.addItem(item);
    } else {
      const newEmptyItem: MenuItem = {
        name: null,
        price: null,
        ratings: {
          fiveStar: 0,
          fourStar: 0,
          threeStar: 0,
          twoStar: 0,
          oneStar: 0
        },
        averageRating: 0,
        reviewCount: 0,
        menuSection: this.selectedSection
      };
      const itemToCreate = {...newEmptyItem, ...this.itemForm.value};
      this.menuService.addItem(itemToCreate);
    }
    this.snackBar.open('Menu Item Created!', '', {
      duration: 2000,
    });
  }

  createItemDialog() {
    const newEmptyItem: MenuItem = {
      name: '',
      price: 0,
      ratings: {
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0
      },
      averageRating: 0,
      reviewCount: 0,
      menuSection: this.selectedSection
    };
    const addItemDialogRef = this.dialog.open(AddMenuItemDialogComponent, newEmptyItem);

    addItemDialogRef.afterClosed().subscribe((item: MenuItem) => {
      if (item) {
           // this.addNewMenuCategory(category);
          const itemToCreate = {...newEmptyItem, ...item};
          console.log(itemToCreate);

          this.createItem(itemToCreate);
      }

    });
  }
}
