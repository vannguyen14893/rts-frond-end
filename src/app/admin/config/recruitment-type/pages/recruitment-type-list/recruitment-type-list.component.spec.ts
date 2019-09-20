import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruitmentTypeListComponent } from './recruitment-type-list.component';

describe('RecruitmentTypeListComponent', () => {
  let component: RecruitmentTypeListComponent;
  let fixture: ComponentFixture<RecruitmentTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruitmentTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruitmentTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
