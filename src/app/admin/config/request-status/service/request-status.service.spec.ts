import { TestBed, inject } from '@angular/core/testing';
import { RequestStatusService } from './request-status.service';


describe('RequestStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestStatusService]
    });
  });

  it('should be created', inject([RequestStatusService], (service: RequestStatusService) => {
    expect(service).toBeTruthy();
  }));
});
