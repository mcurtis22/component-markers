import { TestBed, inject } from '@angular/core/testing';

import { DemoMapService } from './demo-map.service';

describe('DemoMapService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoMapService]
    });
  });

  it('should be created', inject([DemoMapService], (service: DemoMapService) => {
    expect(service).toBeTruthy();
  }));
});
