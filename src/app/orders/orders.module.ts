
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';

// import { GroupPipe } from '../group.pipe';

import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
  { path: '', component: OrdersComponent, canActivate: [AuthGuard] }
];

@NgModule({
imports: [
  CommonModule,
  SharedModule,
  RouterModule.forChild(routes)
],
declarations: [OrdersComponent],
entryComponents: [],
})
export class OrdersModule { }
