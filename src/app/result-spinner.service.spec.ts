import { TestBed } from '@angular/core/testing';

import { ResultSpinnerService } from './result-spinner.service';

describe('ResultSpinnerService', () => {
  let service: ResultSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
