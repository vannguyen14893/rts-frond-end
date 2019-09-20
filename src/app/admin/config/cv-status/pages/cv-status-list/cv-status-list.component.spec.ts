import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CvStatusListComponent } from './cv-status-list.component';

describe('CvStatusListComponent', () => {
  let component: CvStatusListComponent;
  let fixture: ComponentFixture<CvStatusListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CvStatusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CvStatusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
