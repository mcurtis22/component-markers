import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoMapComponent } from './demo-map.component';

describe('DemoMapComponent', () => {
  let component: DemoMapComponent;
  let fixture: ComponentFixture<DemoMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
