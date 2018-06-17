import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { MenuCategory } from './../menu.service';

import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-add-a-category-dialog',
  templateUrl: './add-a-category-dialog.component.html',
  styleUrls: ['./add-a-category-dialog.component.css']
})
export class AddACategoryDialogComponent {

  categoryForm: FormGroup;
  editing: boolean;

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddACategoryDialogComponent>,
      @Inject(MAT_DIALOG_DATA) {
          name
        }: MenuCategory ) {

      this.editing = name !== '' && name !== null;

      this.categoryForm = fb.group({
          name: [name, Validators.required]
      });
  }

  save() {
      this.dialogRef.close(this.categoryForm.value);
  }

  close() {
      this.dialogRef.close();
  }

}
