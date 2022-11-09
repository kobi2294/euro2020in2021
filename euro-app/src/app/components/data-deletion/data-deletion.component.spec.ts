import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataDeletionComponent } from './data-deletion.component';

describe('DataDeletionComponent', () => {
  let component: DataDeletionComponent;
  let fixture: ComponentFixture<DataDeletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataDeletionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataDeletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
