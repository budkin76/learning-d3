import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StarbreakCoffeeComponent } from './starbreak-coffee.component';

describe('StarbreakCoffeeComponent', () => {
  let component: StarbreakCoffeeComponent;
  let fixture: ComponentFixture<StarbreakCoffeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StarbreakCoffeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StarbreakCoffeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
