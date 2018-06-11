import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { forkJoin } from 'rxjs';
import { take, map, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './core/auth.service';

export interface MenuItem {
  name?: string;
  description?: string;
  menuSection?: string;
  price?: string;
}

export interface MenuCategory {
  name: string;
  restaurantId?: string;
}

export interface Restaurant {
  address?: { city?: string; state?: string; street?: string; };
  name?: string;
  phone?: string;
  menuSections: string[];
  menuItems?: MenuItem[];
  restaurantReviews?: any[];
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  userRestaurantId?: string;
  restaurantDocRef: AngularFirestoreDocument<Restaurant>;
  restaurant$: Observable<Restaurant>;
  restaurant: BehaviorSubject<Restaurant> = new BehaviorSubject(null);

  constructor(private afs: AngularFirestore, private auth: AuthService) {
    this.restaurant$ = auth.userAuthData.pipe(
      switchMap(user => {
        if (user) {
          this.restaurantDocRef = this.afs.doc<Restaurant>(`restaurants/${user.restaurantId}`);
          return this.restaurantDocRef.valueChanges();
        } else {
          return of(null);
        }
      })
    );

    this.restaurant$.subscribe((restaurant) => {
      if (restaurant) {
        this.restaurant.next(restaurant);
      }
    });
   }

   getMenuItems() {
    return this.auth.userAuthData.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<Restaurant>(`restaurants/${user.restaurantId}`).collection('menuItems').valueChanges();

        } else {
          return of(null);
        }
      })
    );


   }


  // Get all menu categories for a given restaurant
  getMenuCategories(restaurantId?: string) {
    if (this.userRestaurantId) {
      const categoryRef = this.afs.collection('menuSections', ref => ref.where('restaurantId', '==', this.userRestaurantId));
      return categoryRef.valueChanges().pipe(take(1));
    }
  }

  addMenuItem(item: MenuItem) {
    if (item) {
      this.afs.collection('menuItems').add(item);
    }
  }

  addMenuCategory(categories: string[]) {
    if (this.restaurantDocRef && categories) {
      console.log('update categories');
      console.log(categories);
     this.restaurantDocRef.update({menuSections: categories});
    }
  }
}
