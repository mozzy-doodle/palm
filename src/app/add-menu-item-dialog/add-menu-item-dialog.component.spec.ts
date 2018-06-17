import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddACategoryDialogComponent } from './add-a-category-dialog.component';

describe('AddACategoryDialogComponent', () => {
  let component: AddACategoryDialogComponent;
  let fixture: ComponentFixture<AddACategoryDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddACategoryDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddACategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
