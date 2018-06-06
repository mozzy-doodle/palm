import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface MenuItem {
  name: string;
  description?: string;
  restaurantId?: string;
}

export interface MenuCategory {
  name: string;
  restaurantId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private afs: AngularFirestore) { }
  
  // Get all menu categories for a given restaurant
  getMenuCategories(restaurantId: string) {
    const categoryRef = this.afs.collection('menuSections', ref => ref.where('restaurantId', '==', restaurantId) );
    return categoryRef.valueChanges();
  }


  addMenuItem(item: MenuItem) {
    if (item) {
      this.afs.collection('menuItems').add(item);
    }
  }

  addMenuCategory(category: MenuCategory) {
    if (category) {
      this.afs.collection('menuSections').add(category);
    }
  }
}
