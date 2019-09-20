import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvStatusCreateComponent } from './cv-status-create.component';

describe('CvStatusCreateComponent', () => {
  let component: CvStatusCreateComponent;
  let fixture: ComponentFixture<CvStatusCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvStatusCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvStatusCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
