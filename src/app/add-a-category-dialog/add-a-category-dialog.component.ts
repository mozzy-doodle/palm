import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

import { MenuCategory } from './../menu.service';

import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-add-a-category-dialog',
  templateUrl: './add-a-category-dialog.component.html',
  styleUrls: ['./add-a-category-dialog.component.css']
})
export class AddACategoryDialogComponent implements OnInit {

  categoryForm: FormGroup;


  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<AddACategoryDialogComponent>,
      @Inject(MAT_DIALOG_DATA) {
          name,
          restaurantId
        }: MenuCategory ) {

      this.categoryForm = fb.group({
          name: [name, Validators.required]
      });

  }

  ngOnInit() {

  }


  save() {
      this.dialogRef.close(this.categoryForm.value);
  }

  close() {
      this.dialogRef.close();
  }

}
