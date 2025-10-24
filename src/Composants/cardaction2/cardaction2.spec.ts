import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cardaction2 } from './cardaction2';

describe('Cardaction2', () => {
  let component: Cardaction2;
  let fixture: ComponentFixture<Cardaction2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cardaction2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cardaction2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
