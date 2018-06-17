import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { MenuItem } from './../menu.service';

import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-add-menu-item-dialog',
  templateUrl: './add-menu-item-dialog.component.html',
  styleUrls: ['./add-menu-item-dialog.component.css']
})
export class AddMenuItemDialogComponent {

  itemForm: FormGroup;
  editing: boolean;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddMenuItemDialogComponent>,
      @Inject(MAT_DIALOG_DATA) item: MenuItem ) {

      this.editing = item !== null;

      if (item) {
        this.itemForm = fb.group({
          name: [item.name || '', Validators.required],
          price: [item.price ],
          description: item.description
      });
      } else {
        this.itemForm = fb.group({
          name: ['', Validators.required],
          price: [0],
          description: ''
      });
      }

  }

  save() {
      this.dialogRef.close(this.itemForm.value);
  }

  close() {
      this.dialogRef.close();
  }

}


// categoryForm: FormGroup;
// editing: boolean;

// constructor(
//     private fb: FormBuilder,
//     private dialogRef: MatDialogRef<AddACategoryDialogComponent>,
//     @Inject(MAT_DIALOG_DATA) {
//         name
//       }: MenuCategory ) {

//     this.editing = name !== '' && name !== null;

//     this.categoryForm = fb.group({
//         name: [name, Validators.required]
//     });
// }

// save() {
//     this.dialogRef.close(this.categoryForm.value);
// }

// close() {
//     this.dialogRef.close();
// }
