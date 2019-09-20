import { TestBed, inject } from '@angular/core/testing';

import { GlobalAccountService } from './global-account.service';

describe('GlobalAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalAccountService]
    });
  });

  it('should be created', inject([GlobalAccountService], (service: GlobalAccountService) => {
    expect(service).toBeTruthy();
  }));
});
