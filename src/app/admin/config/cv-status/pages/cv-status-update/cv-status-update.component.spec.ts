import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvStatusUpdateComponent } from './cv-status-update.component';

describe('CvStatusUpdateComponent', () => {
  let component: CvStatusUpdateComponent;
  let fixture: ComponentFixture<CvStatusUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvStatusUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvStatusUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
