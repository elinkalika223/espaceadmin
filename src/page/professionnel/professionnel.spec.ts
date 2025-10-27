import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Professionnel } from './professionnel';

describe('Professionnel', () => {
  let component: Professionnel;
  let fixture: ComponentFixture<Professionnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Professionnel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Professionnel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
