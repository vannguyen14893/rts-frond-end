import { TestBed, inject } from '@angular/core/testing';

import { CandidateStatusService } from './candidate-status.service';

describe('CandidateStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidateStatusService]
    });
  });

  it('should be created', inject([CandidateStatusService], (service: CandidateStatusService) => {
    expect(service).toBeTruthy();
  }));
});
