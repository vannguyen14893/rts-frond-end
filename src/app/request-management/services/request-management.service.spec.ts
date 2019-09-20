import { TestBed, inject } from '@angular/core/testing';

import { RequestManagementService } from './request-management.service';

describe('RequestManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestManagementService]
    });
  });

  it('should be created', inject([RequestManagementService], (service: RequestManagementService) => {
    expect(service).toBeTruthy();
  }));
});
