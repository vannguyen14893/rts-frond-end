import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationUpdateComponent } from './certification-update.component';

describe('CertificationUpdateComponent', () => {
  let component: CertificationUpdateComponent;
  let fixture: ComponentFixture<CertificationUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CertificationUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificationUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
