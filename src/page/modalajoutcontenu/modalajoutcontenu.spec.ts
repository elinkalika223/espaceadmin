import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Modalajoutcontenu } from './modalajoutcontenu';

describe('Modalajoutcontenu', () => {
  let component: Modalajoutcontenu;
  let fixture: ComponentFixture<Modalajoutcontenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Modalajoutcontenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Modalajoutcontenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
