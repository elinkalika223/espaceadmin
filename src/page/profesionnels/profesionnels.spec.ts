import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profesionnels } from './profesionnels';

describe('Profesionnels', () => {
  let component: Profesionnels;
  let fixture: ComponentFixture<Profesionnels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profesionnels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profesionnels);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
