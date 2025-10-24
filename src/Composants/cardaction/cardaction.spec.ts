import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardaction } from './cardaction';

describe('Cardaction', () => {
  let component: Cardaction;
  let fixture: ComponentFixture<Cardaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
