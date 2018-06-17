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
  price?: number;
  id?: string;
  averageRating?: number;
  reviewCount?: number;
  ratings: { fiveStar: number; fourStar: number; threeStar: number; twoStar: number; oneStar: number };
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
         // return this.afs.doc<Restaurant>(`restaurants/${user.restaurantId}`).collection('menuItems').valueChanges();
          return this.afs.doc<Restaurant>(`restaurants/${user.restaurantId}`).collection('menuItems').snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const data = action.payload.doc.data();
                const id = action.payload.doc.id;
                return { id, ...data };
              });
            }
          ));

        } else {
          return of(null);
        }
      })
    );
   }


  updateItem(item: MenuItem, id: string) {
    if (item) {
      item.price = parseFloat(item.price.toString());
      this.restaurantDocRef.collection('menuItems').doc(id)
        .update({name: item.name, description: item.description, price: item.price});
    }
  }

  addItem(item: MenuItem) {
    if (item) {
      item.price = parseFloat(item.price.toString());
      this.restaurantDocRef.collection('menuItems').add(item);
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
