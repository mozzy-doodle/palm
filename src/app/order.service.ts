import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { forkJoin } from 'rxjs';
import { take, map, mergeMap, switchMap } from 'rxjs/operators';
import { AuthService } from './core/auth.service';
import { Restaurant, MenuItem, MenuItemStatus } from './menu.service';

export interface Order {
  items?: MenuItem[];
  active: boolean;
  creation: string;
  orderStatus: OrderStatus;
  tableId: string;
  dateString?: any;
  id?: string;
  panelOpen?: boolean;
}

export interface OrderStatus {
  allEntered: boolean;
  paid: boolean;
  readyForBill: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class OrderService {
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

   // TODO: Get all orders for this restaurant
   getOrders(orderStatus: boolean): Observable<Order[]> {
    return this.auth.userAuthData.pipe(
      switchMap(user => {
        if (user) {
        this.restaurantDocRef = this.afs.doc<Restaurant>(`restaurants/${user.restaurantId}`);

          // tslint:disable-next-line:max-line-length
          return this.restaurantDocRef.collection('orders', ref => ref.where('active', '==', orderStatus)).snapshotChanges().pipe(
            map(actions => {
              return actions.map(action => {
                const data = action.payload.doc.data();
                data.dateString = new Date(data.creation.seconds * 1000);
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

   getItemsInOrder(orderId: string): Observable<MenuItem[]> {
    return this.restaurantDocRef.collection('orders').doc(orderId).collection('items').snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data();
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      })
     );
    }


  updateItemInOrder(item: MenuItem, orderId: string) {
      this.restaurantDocRef.collection('orders').doc(orderId).collection('items').doc(item.id)
      .update({status: item.status});
  }

  updateOrder(order: Order) {
    this.restaurantDocRef.collection('orders').doc(order.id).update({ active: order.active });
  }

}
