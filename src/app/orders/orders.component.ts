import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { OrderService, Order } from '../order.service';
import { MenuItem, MenuItemStatus } from '../menu.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  openOrders: Order[];
  completedOrders: Order[];
  selectedOrder: Order;
  panelOpenState: boolean;
  selectedGroupedItems: any;
  // @ViewChild('selectedItems') selectedItems: ElementRef;

  constructor(
    private afs: AngularFirestore,
    private orderService: OrderService) {
}

  ngOnInit() {
    this.getActiveOrders();
    this.getCompletedOrders();

  }

  updateItemStatus(event: any, item: MenuItem, selectedOrder: any) {
    // item.status = event.value.status;
   this.selectedOrder.items =  this.selectedOrder.items.map((x) => {
      if (x === item) {
        x  = item;
      }
      return x;
    });

    this.selectedOrder.orderStatus.allEntered = !this.selectedOrder.items.some((x) => !x.status.entered);

    this.orderService.updateItemInOrder(item, selectedOrder.id);
  }



  groupItemsByPerson(orderItems: any[], property: string) {
  //   const pets = [
  //     {type: 'Dog', name: 'Spot'},
  //     {type: 'Cat', name: 'Tiger'},
  //     {type: 'Dog', name: 'Rover'},
  //     {type: 'Cat', name: 'Leo'}
  // ];

  const grouped = this.groupBy(orderItems, item => item.uid);
  this.selectedGroupedItems = grouped;

  // console.log(grouped);
  // for (const [key, value] of grouped.entries()) {
  //   console.log(key + ' = ' + value);
  // }
  console.log(grouped.get('Dog'));
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

  rejectItemInOrder(item: MenuItem, selectedOrder: any) {
    item.status.rejected = true;
    item.status.entered = false;
    this.selectedOrder.items.map((x) => {
      if (x === item) {
        x  = item;
      }
      return x;
    });
    this.orderService.updateItemInOrder(item, selectedOrder.id);
  }

  updateOrderStatus(order: Order, active: boolean) {
    order.active = active;
    this.orderService.updateOrder(order);
  }

  onTableSelection(event) {
    this.selectedOrder = event.value;
    this.getItemsInOrder(this.selectedOrder.id);
  }

  getActiveOrders() {
    this.orderService.getOrders(true).pipe().subscribe((data) => {
      this.openOrders = data;

      if (!this.selectedOrder) {
        this.selectedOrder = this.openOrders[0]; // Default to first one
      }

      if (this.selectedOrder) {
        this.getItemsInOrder(this.selectedOrder.id);
      }
    });
  }

  getCompletedOrders() {
    this.orderService.getOrders(false).subscribe((data) => {
      this.completedOrders = data;
    });
  }

  // When viewing an order get the items for the order
  getItemsInOrder(orderId: string) {
    this.orderService.getItemsInOrder(orderId).subscribe((x) => {
      this.selectedOrder.items = x.map((y: MenuItem) => {
        y.panelOpen = true;
        return y;
      }); // All orders start out as open
      this.groupItemsByPerson(this.selectedOrder.items, 'uid');
    });
  }

  changeTab(event: MatTabChangeEvent) {
    console.log(event.index);
  }
}



