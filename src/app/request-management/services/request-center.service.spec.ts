import { TestBed, inject } from '@angular/core/testing';

import { RequestCenterService } from './request-center.service';

describe('RequestCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestCenterService]
    });
  });

  it('should be created', inject([RequestCenterService], (service: RequestCenterService) => {
    expect(service).toBeTruthy();
  }));
});
