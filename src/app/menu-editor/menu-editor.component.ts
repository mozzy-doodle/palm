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

        if (!this.selectedSection) {
          this.selectedSection = data.menuSections[0]; // Default to first one
        }
      }
    });
  }

  getAllMenuItems() {
    this.menuService.getMenuItems().subscribe((data) => {
      this.menuItems = data.filter((x) => x.menuSection);
      this.displayedItems = this.menuItems.filter((x: MenuItem) => x.menuSection === this.selectedSection);

      if (!this.selectedItem) {
        this.selectedItem = this.displayedItems[0]; // Default to first one
      }
    });
  }


  onChangeItem(event) {
    this.updating = true;
    this.selectedItem = event.value;
    this.itemForm.patchValue(this.selectedItem); // Update form on menu item section
  }

  onChangeItemMobile(item: any) {
    this.updating = true;
    this.selectedItem = item;
    this.itemForm.patchValue(this.selectedItem); // Update form on menu item section
    this.openItemUpdateDialog(this.selectedItem);
  }

  openItemUpdateDialog(item: MenuItem): void {
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

  editSectionDialog(section: string): void {
    const previousSectionName = section;
    const editSectionDialogRef = this.dialog.open(AddACategoryDialogComponent, {
      data: { name: section }
    });

    editSectionDialogRef.afterClosed().subscribe((newSectionName: { name: string }) => {

      if (newSectionName && previousSectionName && newSectionName.name) {

        const newName = newSectionName.name;


        // tslint:disable-next-line:max-line-length
        this.menuService.updateSectionName(this.restaurant.menuSections, { oldName: previousSectionName, newName: newName }).pipe(take(1)).subscribe(items => {

          items.forEach(job => {
            if (job.menuSection === previousSectionName) {
              job.menuSection = newName;
              this.menuService.updateItem(job, job.id);
            }
          });
          this.selectedSection = newName;
          // Update section name in memory
          this.restaurant.menuSections = this.restaurant.menuSections.map((s: any) => {
            if (s === previousSectionName) {
              s  = newName;
            }
            return s;
          });
          this.menuService.updateMenuSections(this.restaurant.menuSections);

         });

      }

        // this.menuService.updateMenuSections(this.restaurant.menuSections);

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
      this.menuService.updateMenuSections(this.restaurant.menuSections);
    }
  }

  saveItem(item?: MenuItem) {
    if (item) {
      const itemToUpdate = {...this.selectedItem, ...item};
      this.menuService.updateItem(itemToUpdate, this.selectedItem.id);
    } else {
      const itemToUpdate = {...this.selectedItem, ...this.itemForm.value};
      this.menuService.updateItem(itemToUpdate, this.selectedItem.id);
    }
    this.snackBar.open('Item saved!', '', {
      duration: 2000,
    });
  }

  deleteItem(item?: MenuItem) {
    this.menuService.deleteItem(this.itemForm.value, this.selectedItem.id);
    const deleteMessage = 'Deleted ' + this.selectedItem.name.toString();
    this.snackBar.open(deleteMessage, '', {
      duration: 2000,
    });
  }

  // NOTE: pass in item from dialog
  createItem(item?: MenuItem) {
    if (item) {
      this.menuService.addItem(item);
    } else {
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
