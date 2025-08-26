import { TestBed } from '@angular/core/testing';

import { Forca } from './forca';

describe('Forca', () => {
  let service: Forca;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Forca);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
