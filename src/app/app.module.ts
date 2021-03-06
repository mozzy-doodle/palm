import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/auth.guard';

import { SharedModule } from './shared/shared.module';

import { MenuService } from './menu.service';
import { OrderService } from './order.service';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';

import { AddACategoryDialogComponent } from './add-a-category-dialog/add-a-category-dialog.component';
import { AddMenuItemDialogComponent } from './add-menu-item-dialog/add-menu-item-dialog.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { UserFormComponent } from './user-form/user-form.component';

const routes: Routes = [
  {path: '', redirectTo: 'menu-editor', pathMatch: 'full'},
  { path: 'login', component: UserLoginComponent },
  { path: 'menu-editor', loadChildren: './menu-editor/menu-editor.module#MenuEditorModule'},
  { path: 'orders', loadChildren: './orders/orders.module#OrdersModule'},
  { path: 'admin', component: AppComponent, canActivate: [AuthGuard] }

  // {path: '', component: HeroTopComponent},
  // {path: AppConfig.routes.heroes, loadChildren: './heroes/heroes.module#HeroesModule'},
  // {path: AppConfig.routes.error404, component: Error404Component},

  // // otherwise redirect to 404
  // {path: '**', redirectTo: '/' + AppConfig.routes.error404}
];

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AddACategoryDialogComponent,
    AddMenuItemDialogComponent,
    UserProfileComponent,
    UserLoginComponent,
    UserFormComponent,
  ],
  imports: [
      CoreModule,
      SharedModule.forRoot(),
      BrowserAnimationsModule,
      RouterModule.forRoot(routes)
  ],
  providers: [MenuService, OrderService, AuthGuard],
  entryComponents: [AddACategoryDialogComponent, AddMenuItemDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
