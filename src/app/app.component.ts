import { Component, Inject, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import {MediaChange, ObservableMedia} from '@angular/flex-layout';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  AngularFirestore,
  AngularFirestoreCollection
} from 'angularfire2/firestore';

import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  menuSectionCollectionRef: AngularFirestoreCollection<any>;
  menuItemCollectionRef: AngularFirestoreCollection<any>;
  menuItems$: Observable<any[]>;

  constructor(public dialog: MatDialog, private afs: AngularFirestore, private observableMedia: ObservableMedia) {
    this.menuSectionCollectionRef = this.afs.collection<any>('menuSections');
    this.menuItemCollectionRef = this.afs.collection<any>('menuitems');
    this.menuItems$ = this.menuItemCollectionRef.valueChanges();
  }
  

  addAMenuSectionDialog(): void {
    let dialogRef = this.dialog.open(AddAMenuSectionDialogComponent, {
      width: '75%',
      position: { top: '0' },
      data: { name: 'name', animal: 'animal' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.addNewMenuItem('Apples');
      //this.animal = result;
    });
  }

  addNewMenuItem(name: string) {
    if (name && name.trim().length) {
      //this.menuItemCollectionRef.add({ name: name });
    }
  }
}

/**
 * Dialog Component
 */
@Component({
  selector: 'app-add-a-category-dialog',
  templateUrl: './add-a-category-dialog.component.html',
})
export class AddAMenuSectionDialogComponent implements OnInit {
  form: FormGroup;
  @ViewChild('grid') grid: MatGridList;
  
    gridByBreakpoint = {
      xl: 8,
      lg: 6,
      md: 4,
      sm: 2,
      xs: 1
    }
  

  constructor(
    public dialogRef: MatDialogRef<AddAMenuSectionDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.form = this.fb.group({
        name: ['', [Validators.required]]
    });
}

save() {
    this.dialogRef.close(this.form.value);
}

close() {
    this.dialogRef.close();
}
}
