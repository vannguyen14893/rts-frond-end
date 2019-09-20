import { TestBed, inject } from '@angular/core/testing';

import { PriorityService } from './priority.service';

describe('PriorityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PriorityService]
    });
  });

  it('should be created', inject([PriorityService], (service: PriorityService) => {
    expect(service).toBeTruthy();
  }));
});
