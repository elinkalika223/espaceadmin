import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardaction1 } from './cardaction1';

describe('Cardaction1', () => {
  let component: Cardaction1;
  let fixture: ComponentFixture<Cardaction1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardaction1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardaction1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
