import { TestBed, inject } from '@angular/core/testing';
import { CvStatusService } from './cv-status.service';


describe('CvStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CvStatusService]
    });
  });

  it('should be created', inject([CvStatusService], (service: CvStatusService) => {
    expect(service).toBeTruthy();
  }));
});
