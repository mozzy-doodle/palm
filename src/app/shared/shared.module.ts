import {ModuleWithProviders, NgModule} from '@angular/core';

import { LayoutModule } from '@angular/cdk/layout';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';

import { GroupPipe } from '../group.pipe';


// tslint:disable-next-line:max-line-length
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatBadgeModule} from '@angular/material/badge';
import {MatChipsModule} from '@angular/material/chips';

// tslint:disable-next-line:max-line-length
import {MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule} from '@angular/material';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import {MAT_DIALOG_DATA, MatGridList} from '@angular/material';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    LayoutModule,
    FlexLayoutModule,
    MatButtonModule,
     MatMenuModule,
     MatInputModule,
     MatCardModule,
     MatExpansionModule,
     MatButtonToggleModule,
     MatBadgeModule,
     MatChipsModule,
     MatDialogModule,
     MatFormFieldModule,
     MatSnackBarModule,
     MatTabsModule,
     MatCheckboxModule,
     MatGridListModule,
     FormsModule,
     MatDividerModule,
     ReactiveFormsModule,
     MatToolbarModule,
      MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule,
      MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule
  ],
  declarations: [GroupPipe],
  exports: [
    LayoutModule,
    FlexLayoutModule,
    MatButtonModule,
    MatTabsModule,
     MatMenuModule,
     MatExpansionModule,
     MatInputModule,
     MatCardModule,
     MatDialogModule,
     MatFormFieldModule,
     GroupPipe,
     MatChipsModule,
     MatButtonToggleModule,
     MatCheckboxModule,
     MatSnackBarModule,
     MatBadgeModule,
     MatGridListModule,
     MatDividerModule,
     FormsModule,
     ReactiveFormsModule,
     MatListModule,
     MatToolbarModule,
      MatToolbarModule, MatSidenavModule, MatIconModule,
      MatButtonModule, MatMenuModule, MatCheckboxModule, MatToolbarModule, MatSidenavModule, MatIconModule
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
