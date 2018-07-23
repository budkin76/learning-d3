import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GapminderCloneComponent } from './gapminder-clone.component';

describe('GapminderCloneComponent', () => {
  let component: GapminderCloneComponent;
  let fixture: ComponentFixture<GapminderCloneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GapminderCloneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GapminderCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
