import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuEditorComponent } from './menu-editor.component';

import { SharedModule } from '../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/auth.guard';

const routes: Routes = [
    { path: '', component: MenuEditorComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [

  CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MenuEditorComponent],
  entryComponents: [],
})
export class MenuEditorModule { }
