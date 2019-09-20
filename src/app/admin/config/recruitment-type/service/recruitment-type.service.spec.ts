import { TestBed, inject } from '@angular/core/testing';
import { RecruimentService } from './recruiment-type.service';


describe('DepartmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecruimentService]
    });
  });

  it('should be created', inject([RecruimentService], (service: RecruimentService) => {
    expect(service).toBeTruthy();
  }));
});
