import { TestBed, inject } from '@angular/core/testing';

import { ActionCreatorService } from '../../core/services/action-creator.service';

describe('ActionCreatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActionCreatorService]
    });
  });

  it('should be created', inject([ActionCreatorService], (service: ActionCreatorService) => {
    expect(service).toBeTruthy();
  }));
});
